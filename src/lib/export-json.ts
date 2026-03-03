import type { Report, Block, Annotation } from "./types";

export interface ExportedReport {
  version: 1;
  exported_at: string;
  report: Report;
  blocks: Block[];
  annotations: Annotation[];
}

export function exportReportAsJson(
  report: Report,
  blocks: Block[],
  annotations: Annotation[]
): void {
  const data: ExportedReport = {
    version: 1,
    exported_at: new Date().toISOString(),
    report,
    blocks,
    annotations,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.title || "report"}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
