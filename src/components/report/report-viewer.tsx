"use client";

import { useReport } from "@/contexts/report-context";
import { BlockRenderer } from "./block-renderer";

export function ReportViewer() {
  const { report, blocks } = useReport();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{report.title}</h1>
        {report.description && (
          <p className="mt-2 text-muted-foreground">{report.description}</p>
        )}
      </div>

      <div className="space-y-2">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
