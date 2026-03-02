"use client";

import { useReport } from "@/contexts/report-context";
import type { Block, TextContent } from "@/lib/types";

interface TextBlockProps {
  block: Block;
}

export function TextBlock({ block }: TextBlockProps) {
  const { updateBlock, isEditing } = useReport();
  const content = block.content as TextContent;

  if (!isEditing) {
    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content.html || "<p></p>" }}
      />
    );
  }

  return (
    <div
      className="prose prose-sm max-w-none min-h-[2rem] rounded border border-transparent px-3 py-2 focus-within:border-border"
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        updateBlock(block.id, { html: e.currentTarget.innerHTML });
      }}
      dangerouslySetInnerHTML={{ __html: content.html || "" }}
    />
  );
}
