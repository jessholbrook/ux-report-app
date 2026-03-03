"use client";

import { AIReportProvider } from "@/contexts/ai-report-context";
import { AIReportViewer } from "@/components/ai-report/ai-report-viewer";
import { demoAIReport } from "@/lib/ai-report-demo-data";

export default function AIReportDemoPage() {
  return (
    <AIReportProvider initialReport={demoAIReport} isDemo={true}>
      <AIReportViewer />
    </AIReportProvider>
  );
}
