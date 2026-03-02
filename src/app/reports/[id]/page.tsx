"use client";

import { ReportProvider } from "@/contexts/report-context";
import { ReportViewer } from "@/components/report/report-viewer";

// TODO: Load report from Supabase by ID or share_token
export default function ReportViewPage() {
  return (
    <ReportProvider isEditing={false}>
      <ReportViewer />
    </ReportProvider>
  );
}
