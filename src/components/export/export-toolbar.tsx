"use client";

import { useState } from "react";
import { useReport } from "@/contexts/report-context";
import { Button } from "@/components/ui/button";
import { ImportDialog } from "./import-dialog";
import { exportReportAsJson } from "@/lib/export-json";

export function ExportToolbar() {
  const { report, blocks, annotations, saveFailed, lastSaved, isDemo } =
    useReport();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);

  async function handlePdfExport() {
    setExporting(true);
    setExportError(false);
    try {
      // Loaded on demand: jspdf + html-to-image are heavy and only needed here
      const { exportReportAsPdf } = await import("@/lib/export-pdf");
      await exportReportAsPdf(report.title, blocks, annotations);
    } catch (err) {
      console.error("PDF export failed:", err);
      setExportError(true);
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
      {exportError && (
        <span className="text-xs text-destructive" role="alert">
          PDF export failed — try again
        </span>
      )}
      {!isDemo && saveFailed && (
        <span className="text-xs text-destructive ml-auto" role="alert">
          Save failed — browser storage may be full. Recent changes are not
          saved.
        </span>
      )}
      {!isDemo && !saveFailed && lastSaved && (
        <span className="text-xs text-muted-foreground ml-auto">
          Saved {formatTime(lastSaved)}
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
