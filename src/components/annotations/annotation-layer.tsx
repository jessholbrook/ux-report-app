"use client";

import { useCallback, type ReactNode } from "react";
import { useReport } from "@/contexts/report-context";
import { AnnotationPin } from "./annotation-pin";
import type { ImageKey } from "@/lib/types";

interface AnnotationLayerProps {
  blockId: string;
  imageKey: ImageKey;
  children: ReactNode;
}

export function AnnotationLayer({
  blockId,
  imageKey,
  children,
}: AnnotationLayerProps) {
  const { addAnnotation, getBlockAnnotations, isEditing } = useReport();
  const annotations = getBlockAnnotations(blockId, imageKey);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditing) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      // Don't create annotation if clicking on an existing pin
      if ((e.target as HTMLElement).closest("[data-annotation-pin]")) return;

      addAnnotation(blockId, imageKey, xPct, yPct);
    },
    [addAnnotation, blockId, imageKey, isEditing]
  );

  return (
    <div
      className="relative"
      onClick={handleClick}
      style={{ cursor: isEditing ? "crosshair" : "default" }}
    >
      {children}
      {annotations.map((annotation) => (
        <AnnotationPin key={annotation.id} annotation={annotation} />
      ))}
    </div>
  );
}
