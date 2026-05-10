import type { AIReport } from "./ai-report-types";

export interface ExportedAIReport {
  version: 1;
  type: "ai-report";
  exported_at: string;
  report: AIReport;
}

export function exportAIReportAsJson(report: AIReport): void {
  const data: ExportedAIReport = {
    version: 1,
    type: "ai-report",
    exported_at: new Date().toISOString(),
    report,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.title || "ai-report"}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importAIReportFromJson(
  jsonString: string
): AIReport {
  const data = JSON.parse(jsonString) as ExportedAIReport;
  if (data.type !== "ai-report" || data.version !== 1) {
    throw new Error("Invalid AI report export format");
  }
  return data.report;
}
