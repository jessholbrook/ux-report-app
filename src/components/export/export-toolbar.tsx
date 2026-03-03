"use client";

import { useState } from "react";
import { useReport } from "@/contexts/report-context";
import { Button } from "@/components/ui/button";
import { ImportDialog } from "./import-dialog";
import { exportReportAsJson } from "@/lib/export-json";
import { exportReportAsPdf } from "@/lib/export-pdf";

export function ExportToolbar() {
  const { report, blocks, annotations, isSaving, lastSaved, isDemo } =
    useReport();
  const [exporting, setExporting] = useState(false);

  async function handlePdfExport() {
    setExporting(true);
    try {
      await exportReportAsPdf(report.title, blocks, annotations);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  function handleJsonExport() {
    exportReportAsJson(report, blocks, annotations);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePdfExport}
        disabled={exporting}
      >
        {exporting ? "Exporting..." : "Download PDF"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleJsonExport}>
        Export JSON
      </Button>
      <ImportDialog />
      {!isDemo && lastSaved && (
        <span className="text-xs text-muted-foreground ml-auto">
          {isSaving ? "Saving..." : `Saved ${formatTime(lastSaved)}`}
        </span>
      )}
    </div>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
