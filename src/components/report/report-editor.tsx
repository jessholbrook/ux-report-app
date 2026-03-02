"use client";

import { useCallback, useState } from "react";
import { useReport } from "@/contexts/report-context";
import { BlockRenderer } from "./block-renderer";
import { BlockToolbar } from "./block-toolbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ReportEditor() {
  const { report, blocks, moveBlock, updateReportField, isDemo } = useReport();
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragOverIndex !== index) {
        setDragOverIndex(index);
      }
    },
    [dragOverIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      const blockId = e.dataTransfer.getData("text/plain");
      if (blockId) {
        moveBlock(blockId, targetIndex);
      }
      setDragOverIndex(null);
    },
    [moveBlock]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {isDemo && (
        <div className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-800 border border-amber-200">
          Demo Mode — Sign up to save your reports
        </div>
      )}

      <div className="mb-8 space-y-3">
        <Input
          value={report.title}
          onChange={(e) => updateReportField("title", e.target.value)}
          placeholder="Report title..."
          className="border-none text-3xl font-bold shadow-none focus-visible:ring-0 px-0 h-auto"
        />
        <Textarea
          value={report.description || ""}
          onChange={(e) => updateReportField("description", e.target.value)}
          placeholder="Add a description..."
          className="border-none shadow-none focus-visible:ring-0 px-0 resize-none text-muted-foreground"
          rows={2}
        />
      </div>

      <div className="space-y-1">
        {blocks.map((block, index) => (
          <div key={block.id}>
            <div
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`transition-all ${
                dragOverIndex === index
                  ? "border-t-2 border-primary pt-2"
                  : ""
              }`}
            >
              <BlockRenderer block={block} />
            </div>
          </div>
        ))}

        {/* Drop zone at the end */}
        <div
          onDragOver={(e) => handleDragOver(e, blocks.length)}
          onDrop={(e) => handleDrop(e, blocks.length)}
          className={`min-h-4 transition-all ${
            dragOverIndex === blocks.length
              ? "border-t-2 border-primary pt-2"
              : ""
          }`}
        />
      </div>

      <BlockToolbar
        afterPosition={
          blocks.length > 0
            ? Math.max(...blocks.map((b) => b.position))
            : undefined
        }
      />
    </div>
  );
}
