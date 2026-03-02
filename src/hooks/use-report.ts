import { createClient } from "@/lib/supabase/client";
import type { Report, Block, Annotation } from "@/lib/types";

const supabase = createClient();

export async function fetchReport(id: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Report;
}

export async function fetchReportByShareToken(token: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error) throw error;
  return data as Report;
}

export async function fetchBlocks(reportId: string) {
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("report_id", reportId)
    .order("position");

  if (error) throw error;
  return data as Block[];
}

export async function fetchAnnotations(blockIds: string[]) {
  if (blockIds.length === 0) return [];

  const { data, error } = await supabase
    .from("annotations")
    .select("*")
    .in("block_id", blockIds);

  if (error) throw error;
  return data as Annotation[];
}

export async function saveReport(report: Report) {
  const { error } = await supabase.from("reports").upsert(report);
  if (error) throw error;
}

export async function saveBlocks(reportId: string, blocks: Block[]) {
  // Delete removed blocks
  await supabase
    .from("blocks")
    .delete()
    .eq("report_id", reportId)
    .not("id", "in", `(${blocks.map((b) => b.id).join(",")})`);

  // Upsert all blocks
  const { error } = await supabase.from("blocks").upsert(blocks);
  if (error) throw error;
}

export async function saveAnnotations(
  blockIds: string[],
  annotations: Annotation[]
) {
  // Delete removed annotations for these blocks
  for (const blockId of blockIds) {
    const blockAnnotations = annotations
      .filter((a) => a.block_id === blockId)
      .map((a) => a.id);

    if (blockAnnotations.length > 0) {
      await supabase
        .from("annotations")
        .delete()
        .eq("block_id", blockId)
        .not("id", "in", `(${blockAnnotations.join(",")})`);
    } else {
      await supabase.from("annotations").delete().eq("block_id", blockId);
    }
  }

  // Upsert all annotations
  if (annotations.length > 0) {
    const { error } = await supabase.from("annotations").upsert(annotations);
    if (error) throw error;
  }
}

export async function createReport(title: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("reports")
    .insert({ owner_id: user.id, title })
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function deleteReport(id: string) {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) throw error;
}

export async function listUserReports() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Report[];
}
