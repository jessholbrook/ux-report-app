"use client";

import { useAIReport } from "@/contexts/ai-report-context";
import { Button } from "@/components/ui/button";
import { exportAIReportAsJson } from "@/lib/ai-report-export";
import { Download } from "lucide-react";

export function AIExportToolbar() {
  const { report, isSaving, lastSaved, isDemo } = useAIReport();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportAIReportAsJson(report)}
      >
        <Download className="size-3.5 mr-1.5" />
        Export JSON
      </Button>
      {!isDemo && lastSaved && (
        <span className="text-xs text-muted-foreground ml-auto">
          {isSaving
            ? "Saving..."
            : `Saved ${lastSaved.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}`}
        </span>
      )}
    </div>
  );
}
