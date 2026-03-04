"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { saveAIReport } from "@/lib/ai-report-storage";
import type { AIReport } from "@/lib/ai-report-types";

export default function NewAIReportPage() {
  const router = useRouter();

  useEffect(() => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const report: AIReport = {
      id,
      title: "Untitled AI Report",
      summary: "",
      status: "draft",
      created_at: now,
      updated_at: now,
      version: 1,
      authors: [],
      ai_contributors: [],
      sections: [],
      methodology: {
        overview: "",
        prompts: [],
        reasoning_summaries: [],
      },
      suggested_reviewers: [],
      suggested_collaborators: [],
      reviews: [],
      repo_links: [],
      data_sources: [],
      related_reports: [],
      tags: [],
    };
    saveAIReport(report);
    router.replace(`/ai-reports/${id}/edit`);
  }, [router]);

  return null;
}
