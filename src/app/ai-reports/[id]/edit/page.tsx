"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AIReportProvider } from "@/contexts/ai-report-context";
import { AIReportEditor } from "@/components/ai-report/ai-report-editor";
import { loadAIReport } from "@/lib/ai-report-storage";
import { Button } from "@/components/ui/button";
import type { AIReport } from "@/lib/ai-report-types";

export default function AIReportEditPage() {
  const params = useParams();
  const [report, setReport] = useState<AIReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    setReport(loadAIReport(id));
    setLoaded(true);
  }, [params.id]);

  if (!loaded) return null;

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-bold">Report not found</h1>
        <p className="mt-2 text-muted-foreground">
          This report may have been deleted or the link is invalid.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/ai-reports">Back to AI Reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <AIReportProvider initialReport={report} isEditing={true}>
      <AIReportEditor />
    </AIReportProvider>
  );
}
