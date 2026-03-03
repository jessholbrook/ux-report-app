import type { Report, Block, Annotation } from "./types";

const INDEX_KEY = "ux-reports-index";
const REPORT_KEY_PREFIX = "ux-report:";

export interface ReportIndexEntry {
  id: string;
  title: string;
  description: string | null;
  updated_at: string;
}

export interface StoredReport {
  report: Report;
  blocks: Block[];
  annotations: Annotation[];
}

function reportKey(id: string) {
  return `${REPORT_KEY_PREFIX}${id}`;
}

export function listLocalReports(): ReportIndexEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReportIndexEntry[];
  } catch {
    return [];
  }
}

export function loadLocalReport(id: string): StoredReport | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(reportKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredReport;
  } catch {
    return null;
  }
}

export function saveLocalReport(
  report: Report,
  blocks: Block[],
  annotations: Annotation[]
): void {
  if (typeof window === "undefined") return;

  // Save full report data
  const stored: StoredReport = { report, blocks, annotations };
  localStorage.setItem(reportKey(report.id), JSON.stringify(stored));

  // Update index
  const index = listLocalReports();
  const existing = index.findIndex((e) => e.id === report.id);
  const entry: ReportIndexEntry = {
    id: report.id,
    title: report.title,
    description: report.description,
    updated_at: new Date().toISOString(),
  };

  if (existing >= 0) {
    index[existing] = entry;
  } else {
    index.unshift(entry);
  }

  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function deleteLocalReport(id: string): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(reportKey(id));

  const index = listLocalReports().filter((e) => e.id !== id);
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}
