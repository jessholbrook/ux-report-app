-- Fix: the "inherit access" policies on blocks and annotations were FOR ALL,
-- so their USING clause (which grants access to public/shared reports) was
-- also applied to INSERT/UPDATE/DELETE. Because permissive policies combine
-- with OR, this let any visitor — including unauthenticated anon-key clients —
-- write to and delete blocks/annotations of any public or shared report.
-- Read access for viewers must be SELECT-only; writes stay owner-only via the
-- existing "Owner can ..." policies.

drop policy if exists "Blocks inherit report access" on blocks;

create policy "Blocks inherit report access" on blocks
  for select using (
    exists (
      select 1 from reports where reports.id = blocks.report_id
      and (
        reports.owner_id = auth.uid()
        or reports.is_public = true
        or exists (
          select 1 from report_shares
          where report_shares.report_id = reports.id
          and report_shares.email = (auth.jwt() ->> 'email')
        )
      )
    )
  );

drop policy if exists "Annotations inherit block access" on annotations;

create policy "Annotations inherit block access" on annotations
  for select using (
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
          and report_shares.email = (auth.jwt() ->> 'email')
        )
      )
    )
  );

-- Hardening: resolve the caller's email from the JWT instead of selecting
-- from auth.users, which the authenticated role may not be able to read.

drop policy if exists "Shared reports readable" on reports;

create policy "Shared reports readable" on reports
  for select using (
    exists (
      select 1 from report_shares
      where report_shares.report_id = reports.id
      and report_shares.email = (auth.jwt() ->> 'email')
    )
  );

drop policy if exists "User can read own share" on report_shares;

create policy "User can read own share" on report_shares
  for select using (
    email = (auth.jwt() ->> 'email')
  );
