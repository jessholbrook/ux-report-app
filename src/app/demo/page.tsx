"use client";

import { ReportProvider } from "@/contexts/report-context";
import { ReportEditor } from "@/components/report/report-editor";
import { demoReport, demoBlocks, demoAnnotations } from "@/lib/demo-data";

export default function DemoPage() {
  return (
    <ReportProvider
      initialReport={demoReport}
      initialBlocks={demoBlocks}
      initialAnnotations={demoAnnotations}
      isDemo={true}
      isEditing={true}
    >
      <ReportEditor />
    </ReportProvider>
  );
}
