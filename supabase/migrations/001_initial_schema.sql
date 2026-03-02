-- Profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Reports
create table reports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null default 'Untitled Report',
  description text,
  is_public boolean default false,
  share_token text unique default gen_random_uuid()::text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table reports enable row level security;

create policy "Owner full access" on reports
  for all using (auth.uid() = owner_id);

create policy "Public reports readable" on reports
  for select using (is_public = true);

create policy "Shared reports readable" on reports
  for select using (
    exists (
      select 1 from report_shares
      where report_shares.report_id = reports.id
      and report_shares.email = (select email from auth.users where id = auth.uid())
    )
  );

-- Blocks
create table blocks (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  type text not null check (type in ('text', 'heading', 'image', 'comparison', 'divider')),
  position integer not null default 0,
  content jsonb not null default '{}',
  created_at timestamptz default now()
);

alter table blocks enable row level security;

create policy "Blocks inherit report access" on blocks
  for all using (
    exists (
      select 1 from reports where reports.id = blocks.report_id
      and (
        reports.owner_id = auth.uid()
        or reports.is_public = true
        or exists (
          select 1 from report_shares
          where report_shares.report_id = reports.id
          and report_shares.email = (select email from auth.users where id = auth.uid())
        )
      )
    )
  );

create policy "Owner can modify blocks" on blocks
  for insert with check (
    exists (select 1 from reports where reports.id = blocks.report_id and reports.owner_id = auth.uid())
  );

create policy "Owner can update blocks" on blocks
  for update using (
    exists (select 1 from reports where reports.id = blocks.report_id and reports.owner_id = auth.uid())
  );

create policy "Owner can delete blocks" on blocks
  for delete using (
    exists (select 1 from reports where reports.id = blocks.report_id and reports.owner_id = auth.uid())
  );

-- Annotations
create table annotations (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references blocks(id) on delete cascade,
  image_key text not null default 'default' check (image_key in ('default', 'before', 'after')),
  x_pct float not null,
  y_pct float not null,
  label integer not null,
  type text not null default 'finding' check (type in ('finding', 'implication', 'change')),
  text text not null default '',
  created_at timestamptz default now()
);

alter table annotations enable row level security;

create policy "Annotations inherit block access" on annotations
  for all using (
    exists (
      select 1 from blocks
      join reports on reports.id = blocks.report_id
      where blocks.id = annotations.block_id
      and (
        reports.owner_id = auth.uid()
        or reports.is_public = true
        or exists (
          select 1 from report_shares
          where report_shares.report_id = reports.id
          and report_shares.email = (select email from auth.users where id = auth.uid())
        )
      )
    )
  );

create policy "Owner can modify annotations" on annotations
  for insert with check (
    exists (
      select 1 from blocks
      join reports on reports.id = blocks.report_id
      where blocks.id = annotations.block_id and reports.owner_id = auth.uid()
    )
  );

create policy "Owner can update annotations" on annotations
  for update using (
    exists (
      select 1 from blocks
      join reports on reports.id = blocks.report_id
      where blocks.id = annotations.block_id and reports.owner_id = auth.uid()
    )
  );

create policy "Owner can delete annotations" on annotations
  for delete using (
    exists (
      select 1 from blocks
      join reports on reports.id = blocks.report_id
      where blocks.id = annotations.block_id and reports.owner_id = auth.uid()
    )
  );

-- Report Shares
create table report_shares (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  email text not null,
  created_at timestamptz default now(),
  unique (report_id, email)
);

alter table report_shares enable row level security;

create policy "Owner manages shares" on report_shares
  for all using (
    exists (select 1 from reports where reports.id = report_shares.report_id and reports.owner_id = auth.uid())
  );

create policy "User can read own share" on report_shares
  for select using (
    email = (select email from auth.users where id = auth.uid())
  );

-- Storage bucket for images
insert into storage.buckets (id, name, public) values ('report-images', 'report-images', true)
on conflict do nothing;

create policy "Authenticated users can upload images" on storage.objects
  for insert with check (bucket_id = 'report-images' and auth.role() = 'authenticated');

create policy "Anyone can view report images" on storage.objects
  for select using (bucket_id = 'report-images');
