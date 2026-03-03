import { v4 as uuidv4 } from "uuid";
import { saveLocalReport } from "./local-storage";
import type { ExportedReport } from "./export-json";
import type { Report, Block, Annotation } from "./types";

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

  return true;
}

export function importReport(data: ExportedReport): string {
  const newReportId = uuidv4();
  const oldBlockIdMap = new Map<string, string>();

  // Re-map block IDs
  const blocks: Block[] = data.blocks.map((block) => {
    const newBlockId = uuidv4();
    oldBlockIdMap.set(block.id, newBlockId);
    return { ...block, id: newBlockId, report_id: newReportId };
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
