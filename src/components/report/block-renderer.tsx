"use client";

import { useReport } from "@/contexts/report-context";
import { TextBlock } from "./blocks/text-block";
import { HeadingBlock } from "./blocks/heading-block";
import { ImageBlock } from "./blocks/image-block";
import { ComparisonBlock } from "./blocks/comparison-block";
import { DividerBlock } from "./blocks/divider-block";
import { Button } from "@/components/ui/button";
import type { Block } from "@/lib/types";

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { removeBlock, isEditing, activeBlockId, setActiveBlock } = useReport();
  const isActive = activeBlockId === block.id;

  const content = (() => {
    switch (block.type) {
      case "text":
        return <TextBlock block={block} />;
      case "heading":
        return <HeadingBlock block={block} />;
      case "image":
        return <ImageBlock block={block} />;
      case "comparison":
        return <ComparisonBlock block={block} />;
      case "divider":
        return <DividerBlock />;
    }
  })();

  if (!isEditing) {
    return <div className="py-2">{content}</div>;
  }

  return (
    <div
      className={`group relative rounded-lg border py-3 px-4 transition-colors ${
        isActive ? "border-primary/50 bg-accent/30" : "border-transparent hover:border-border"
      }`}
      onClick={() => setActiveBlock(block.id)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", block.id);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      {/* Drag handle + delete */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="cursor-grab text-muted-foreground hover:text-foreground">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>

      {isActive && (
        <div className="absolute -right-2 -top-2 z-10">
          <Button
            variant="destructive"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            &times;
          </Button>
        </div>
      )}

      {content}
    </div>
  );
}
