"use client";

import { useReport } from "@/contexts/report-context";
import type { Block, HeadingContent } from "@/lib/types";

interface HeadingBlockProps {
  block: Block;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const { updateBlock, isEditing } = useReport();
  const content = block.content as HeadingContent;

  const Tag = `h${content.level}` as "h1" | "h2" | "h3";
  const sizeClass = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-medium",
  }[content.level];

  if (!isEditing) {
    return <Tag className={sizeClass}>{content.text || "Untitled"}</Tag>;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={content.level}
        onChange={(e) =>
          updateBlock(block.id, {
            level: Number(e.target.value) as 1 | 2 | 3,
          })
        }
        className="rounded border bg-muted px-2 py-1 text-xs"
      >
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
      </select>
      <input
        type="text"
        value={content.text}
        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
        placeholder="Heading text..."
        className={`${sizeClass} flex-1 bg-transparent outline-none`}
      />
    </div>
  );
}
