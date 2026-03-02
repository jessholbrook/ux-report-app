"use client";

import { ReportProvider } from "@/contexts/report-context";
import { ReportEditor } from "@/components/report/report-editor";

// TODO: Load report from Supabase by ID, verify ownership
export default function EditReportPage() {
  return (
    <ReportProvider isEditing={true}>
      <ReportEditor />
    </ReportProvider>
  );
}
