"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportProvider } from "@/contexts/report-context";
import { ReportEditor } from "@/components/report/report-editor";
import { loadLocalReport, type StoredReport } from "@/lib/local-storage";

export default function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<StoredReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadLocalReport(id);
    if (stored) {
      setData(stored);
    } else {
      router.replace("/");
    }
    setLoading(false);
  }, [id, router]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <ReportProvider
      isEditing={true}
      initialReport={data.report}
      initialBlocks={data.blocks}
      initialAnnotations={data.annotations}
      persistLocally={true}
    >
      <ReportEditor />
    </ReportProvider>
  );
}
