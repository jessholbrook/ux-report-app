"use client";

import { useRef, useCallback } from "react";
import { useReport } from "@/contexts/report-context";
import { SliderComparison } from "@/components/comparison/slider-comparison";
import { SideBySide } from "@/components/comparison/side-by-side";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Block, ComparisonContent, ComparisonMode } from "@/lib/types";

interface ComparisonBlockProps {
  block: Block;
}

export function ComparisonBlock({ block }: ComparisonBlockProps) {
  const { updateBlock, isEditing, isDemo } = useReport();
  const content = block.content as ComparisonContent;
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (key: "before_url" | "after_url") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          updateBlock(block.id, { [key]: reader.result as string });
        };
        reader.readAsDataURL(file);
      },
    [block.id, updateBlock]
  );

  const toggleMode = useCallback(() => {
    const next: ComparisonMode =
      content.default_mode === "slider" ? "side-by-side" : "slider";
    updateBlock(block.id, { default_mode: next });
  }, [block.id, content.default_mode, updateBlock]);

  const hasImages = content.before_url && content.after_url;

  if (!hasImages) {
    if (!isEditing) return null;

    return (
      <div className="rounded-lg border-2 border-dashed p-6">
        <p className="mb-4 text-center text-sm font-medium">
          Before / After Comparison
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">Before</p>
            {content.before_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.before_url}
                alt="Before"
                className="max-h-32 rounded"
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => beforeInputRef.current?.click()}
              >
                Upload Before
              </Button>
            )}
            <input
              ref={beforeInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile("before_url")}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">After</p>
            {content.after_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.after_url}
                alt="After"
                className="max-h-32 rounded"
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => afterInputRef.current?.click()}
              >
                Upload After
              </Button>
            )}
            <input
              ref={afterInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile("after_url")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isEditing && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Input
              value={content.before_label}
              onChange={(e) =>
                updateBlock(block.id, { before_label: e.target.value })
              }
              placeholder="Before label"
              className="w-28 text-xs"
            />
            <Input
              value={content.after_label}
              onChange={(e) =>
                updateBlock(block.id, { after_label: e.target.value })
              }
              placeholder="After label"
              className="w-28 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" onClick={toggleMode}>
            {content.default_mode === "slider" ? "Side by Side" : "Slider"}
          </Button>
        </div>
      )}

      {!isEditing && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={toggleMode}>
            {content.default_mode === "slider"
              ? "Switch to Side by Side"
              : "Switch to Slider"}
          </Button>
        </div>
      )}

      {content.default_mode === "slider" ? (
        <SliderComparison
          blockId={block.id}
          beforeUrl={content.before_url}
          afterUrl={content.after_url}
          beforeLabel={content.before_label}
          afterLabel={content.after_label}
        />
      ) : (
        <SideBySide
          blockId={block.id}
          beforeUrl={content.before_url}
          afterUrl={content.after_url}
          beforeLabel={content.before_label}
          afterLabel={content.after_label}
        />
      )}
    </div>
  );
}
