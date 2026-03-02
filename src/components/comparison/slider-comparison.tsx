"use client";

import { useState, useCallback, useRef } from "react";
import { AnnotationLayer } from "@/components/annotations/annotation-layer";

interface SliderComparisonProps {
  blockId: string;
  beforeUrl: string;
  afterUrl: string;
  beforeLabel: string;
  afterLabel: string;
}

export function SliderComparison({
  blockId,
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
}: SliderComparisonProps) {
  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [handleMove]);

  const handleTouchStart = useCallback(() => {
    isDragging.current = true;

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-lg"
    >
      {/* Before image (full width, behind) */}
      <AnnotationLayer blockId={blockId} imageKey="before">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeUrl} alt={beforeLabel} className="block w-full" />
      </AnnotationLayer>

      {/* After image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
      >
        <AnnotationLayer blockId={blockId} imageKey="after">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterUrl} alt={afterLabel} className="block w-full" />
        </AnnotationLayer>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-1 cursor-col-resize bg-white shadow-lg"
        style={{ left: `${sliderPct}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4M8 15l4 4 4-4"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 z-10 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 z-10 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
        {afterLabel}
      </div>
    </div>
  );
}
