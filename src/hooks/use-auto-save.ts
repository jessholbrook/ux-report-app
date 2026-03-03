"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { saveLocalReport } from "@/lib/local-storage";
import type { Report, Block, Annotation } from "@/lib/types";

interface AutoSaveOptions {
  report: Report;
  blocks: Block[];
  annotations: Annotation[];
  enabled: boolean;
}

export function useAutoSave({ report, blocks, annotations, enabled }: AutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(() => {
    if (!enabled) return;
    setIsSaving(true);
    saveLocalReport(report, blocks, annotations);
    setIsSaving(false);
    setLastSaved(new Date());
  }, [report, blocks, annotations, enabled]);

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [save, enabled]);

  return { isSaving, lastSaved };
}
