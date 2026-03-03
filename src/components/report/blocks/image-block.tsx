"use client";

import { useCallback, useRef } from "react";
import { useReport } from "@/contexts/report-context";
import { AnnotationLayer } from "@/components/annotations/annotation-layer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Block, ImageContent } from "@/lib/types";

interface ImageBlockProps {
  block: Block;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { updateBlock, isEditing, isDemo } = useReport();
  const content = block.content as ImageContent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        updateBlock(block.id, { url: reader.result as string });
      };
      reader.readAsDataURL(file);
    },
    [block.id, updateBlock]
  );

  if (!content.url) {
    if (!isEditing) return null;

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Drop an image or click to upload
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg">
        <AnnotationLayer blockId={block.id} imageKey="default">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.url}
            alt={content.alt || ""}
            className="w-full"
          />
        </AnnotationLayer>
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            placeholder="Caption..."
            value={content.caption || ""}
            onChange={(e) =>
              updateBlock(block.id, { caption: e.target.value })
            }
            className="text-sm"
          />
          <Input
            placeholder="Alt text..."
            value={content.alt || ""}
            onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
            className="w-40 text-sm"
          />
        </div>
      ) : (
        content.caption && (
          <p className="text-center text-sm text-muted-foreground">
            {content.caption}
          </p>
        )
      )}
    </div>
  );
}
