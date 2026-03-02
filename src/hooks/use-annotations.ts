import { useReport } from "@/contexts/report-context";
import type { AnnotationType, ImageKey } from "@/lib/types";

export function useAnnotations(blockId: string, imageKey?: ImageKey) {
  const {
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    getBlockAnnotations,
    isEditing,
  } = useReport();

  const annotations = getBlockAnnotations(blockId, imageKey);

  function addPin(xPct: number, yPct: number, type?: AnnotationType) {
    return addAnnotation(blockId, imageKey ?? "default", xPct, yPct, type);
  }

  return {
    annotations,
    addPin,
    updateAnnotation,
    removeAnnotation,
    isEditing,
  };
}
