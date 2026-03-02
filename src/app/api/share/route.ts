import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { report_id, email } = await request.json();

  // Verify the user owns this report
  const { data: report } = await supabase
    .from("reports")
    .select("id")
    .eq("id", report_id)
    .eq("owner_id", user.id)
    .single();

  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Add share entry
  const { error } = await supabase
    .from("report_shares")
    .upsert({ report_id, email }, { onConflict: "report_id,email" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Send invite email via Supabase Edge Function or other email service

  return NextResponse.json({ success: true });
}
