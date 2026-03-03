"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  listLocalReports,
  deleteLocalReport,
  type ReportIndexEntry,
} from "@/lib/local-storage";
import { Button } from "@/components/ui/button";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ReportList() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportIndexEntry[]>([]);

  useEffect(() => {
    setReports(listLocalReports());
  }, []);

  function handleDelete(id: string) {
    deleteLocalReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  }

  if (reports.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Reports</h2>
        <Button onClick={() => router.push("/reports/new")}>New Report</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div key={report.id} className="rounded-lg border p-4">
            <Link
              href={`/reports/${report.id}/edit`}
              className="block hover:opacity-80"
            >
              <h3 className="font-semibold truncate">{report.title}</h3>
              {report.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {report.description}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(report.updated_at)}
              </p>
            </Link>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/reports/${report.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(report.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
