"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AnnotationCallout } from "./annotation-callout";
import type { Annotation } from "@/lib/types";

const typeColors = {
  finding: "bg-blue-500",
  implication: "bg-amber-500",
  change: "bg-green-500",
};

interface AnnotationPinProps {
  annotation: Annotation;
}

export function AnnotationPin({ annotation }: AnnotationPinProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          data-annotation-pin
          className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold text-white shadow-md transition-transform hover:scale-110 ${typeColors[annotation.type]}`}
          style={{
            left: `${annotation.x_pct}%`,
            top: `${annotation.y_pct}%`,
          }}
        >
          {annotation.label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" side="right" align="start">
        <AnnotationCallout annotation={annotation} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
