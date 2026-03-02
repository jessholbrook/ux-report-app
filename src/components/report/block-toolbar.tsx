"use client";

import { useReport } from "@/contexts/report-context";
import { Button } from "@/components/ui/button";
import type { BlockType } from "@/lib/types";

interface BlockToolbarProps {
  afterPosition?: number;
}

const blockOptions: { type: BlockType; label: string; icon: string }[] = [
  { type: "text", label: "Text", icon: "T" },
  { type: "heading", label: "Heading", icon: "H" },
  { type: "image", label: "Image", icon: "I" },
  { type: "comparison", label: "Comparison", icon: "C" },
  { type: "divider", label: "Divider", icon: "—" },
];

export function BlockToolbar({ afterPosition }: BlockToolbarProps) {
  const { addBlock } = useReport();

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <span className="text-xs text-muted-foreground">Add:</span>
      {blockOptions.map(({ type, label, icon }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => addBlock(type, afterPosition)}
        >
          <span className="mr-1 font-mono">{icon}</span> {label}
        </Button>
      ))}
    </div>
  );
}
