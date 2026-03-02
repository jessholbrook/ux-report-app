"use client";

import { AnnotationLayer } from "@/components/annotations/annotation-layer";

interface SideBySideProps {
  blockId: string;
  beforeUrl: string;
  afterUrl: string;
  beforeLabel: string;
  afterLabel: string;
}

export function SideBySide({
  blockId,
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
}: SideBySideProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <div className="relative overflow-hidden rounded-lg">
          <AnnotationLayer blockId={blockId} imageKey="before">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeUrl} alt={beforeLabel} className="w-full" />
          </AnnotationLayer>
        </div>
        <p className="text-center text-xs font-medium text-muted-foreground">
          {beforeLabel}
        </p>
      </div>
      <div className="space-y-1">
        <div className="relative overflow-hidden rounded-lg">
          <AnnotationLayer blockId={blockId} imageKey="after">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterUrl} alt={afterLabel} className="w-full" />
          </AnnotationLayer>
        </div>
        <p className="text-center text-xs font-medium text-muted-foreground">
          {afterLabel}
        </p>
      </div>
    </div>
  );
}
