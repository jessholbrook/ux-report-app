import type { AIReport } from "./ai-report-types";

const INDEX_KEY = "ai-reports-index";
const REPORT_KEY_PREFIX = "ai-report:";

export interface AIReportIndexEntry {
  id: string;
  title: string;
  summary: string;
  status: string;
  updated_at: string;
  tags: string[];
}

function reportKey(id: string) {
  return `${REPORT_KEY_PREFIX}${id}`;
}

export function listAIReports(): AIReportIndexEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AIReportIndexEntry[];
  } catch {
    return [];
  }
}

export function loadAIReport(id: string): AIReport | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(reportKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AIReport;
  } catch {
    return null;
  }
}

export function saveAIReport(report: AIReport): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(reportKey(report.id), JSON.stringify(report));

  const index = listAIReports();
  const existing = index.findIndex((e) => e.id === report.id);
  const entry: AIReportIndexEntry = {
    id: report.id,
    title: report.title,
    summary: report.summary,
    status: report.status,
    updated_at: new Date().toISOString(),
    tags: report.tags,
  };

  if (existing >= 0) {
    index[existing] = entry;
  } else {
    index.unshift(entry);
  }

  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function deleteAIReport(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(reportKey(id));
  const index = listAIReports().filter((e) => e.id !== id);
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}
