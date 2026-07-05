import { v4 as uuidv4 } from "uuid";
import { saveLocalReport } from "./local-storage";
import { sanitizeHtml } from "./sanitize";
import type { ExportedReport } from "./export-json";
import type { Report, Block, Annotation } from "./types";

const BLOCK_TYPES = ["text", "heading", "image", "comparison", "divider"];

export function validateExportedReport(data: unknown): data is ExportedReport {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (d.version !== 1) return false;
  if (!d.report || typeof d.report !== "object") return false;
  if (!Array.isArray(d.blocks)) return false;
  if (!Array.isArray(d.annotations)) return false;

  const report = d.report as Record<string, unknown>;
  if (typeof report.id !== "string" || typeof report.title !== "string") {
    return false;
  }

  for (const block of d.blocks) {
    if (!block || typeof block !== "object") return false;
    const b = block as Record<string, unknown>;
    if (typeof b.id !== "string") return false;
    if (typeof b.type !== "string" || !BLOCK_TYPES.includes(b.type)) return false;
    if (typeof b.position !== "number") return false;
    if (!b.content || typeof b.content !== "object") return false;
  }

  for (const annotation of d.annotations) {
    if (!annotation || typeof annotation !== "object") return false;
    const a = annotation as Record<string, unknown>;
    if (typeof a.id !== "string" || typeof a.block_id !== "string") return false;
    if (typeof a.x_pct !== "number" || typeof a.y_pct !== "number") return false;
  }

  return true;
}

export function importReport(data: ExportedReport): string {
  const newReportId = uuidv4();
  const oldBlockIdMap = new Map<string, string>();

  // Re-map block IDs
  const blocks: Block[] = data.blocks.map((block) => {
    const newBlockId = uuidv4();
    oldBlockIdMap.set(block.id, newBlockId);
    // Sanitize imported HTML so a shared .json file can't smuggle scripts in
    const content =
      block.type === "text" && "html" in block.content
        ? { ...block.content, html: sanitizeHtml(block.content.html) }
        : block.content;
    return { ...block, id: newBlockId, report_id: newReportId, content };
  });

  // Re-map annotation IDs and block references
  const annotations: Annotation[] = data.annotations.map((annotation) => ({
    ...annotation,
    id: uuidv4(),
    block_id: oldBlockIdMap.get(annotation.block_id) ?? annotation.block_id,
  }));

  const report: Report = {
    ...data.report,
    id: newReportId,
    share_token: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveLocalReport(report, blocks, annotations);
  return newReportId;
}
