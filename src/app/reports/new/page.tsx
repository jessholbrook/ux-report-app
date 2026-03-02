"use client";

import { ReportProvider } from "@/contexts/report-context";
import { ReportEditor } from "@/components/report/report-editor";

export default function NewReportPage() {
  return (
    <ReportProvider isEditing={true}>
      <ReportEditor />
    </ReportProvider>
  );
}
