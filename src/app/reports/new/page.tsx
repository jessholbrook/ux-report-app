"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { saveLocalReport } from "@/lib/local-storage";
import type { Report } from "@/lib/types";

export default function NewReportPage() {
  const router = useRouter();

  useEffect(() => {
    const id = uuidv4();
    const report: Report = {
      id,
      owner_id: "",
      title: "Untitled Report",
      description: null,
      is_public: false,
      share_token: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveLocalReport(report, [], []);
    router.replace(`/reports/${id}/edit`);
  }, [router]);

  return null;
}
