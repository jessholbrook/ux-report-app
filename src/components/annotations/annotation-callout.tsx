"use client";

import { useReport } from "@/contexts/report-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Annotation, AnnotationType } from "@/lib/types";

const typeLabels: Record<AnnotationType, string> = {
  finding: "Finding",
  implication: "Implication",
  change: "Change",
};

const typeVariants: Record<AnnotationType, "default" | "secondary" | "outline"> = {
  finding: "default",
  implication: "secondary",
  change: "outline",
};

interface AnnotationCalloutProps {
  annotation: Annotation;
  onClose: () => void;
}

export function AnnotationCallout({
  annotation,
  onClose,
}: AnnotationCalloutProps) {
  const { updateAnnotation, removeAnnotation, isEditing } = useReport();

  if (!isEditing) {
    return (
      <div className="p-3">
        <Badge variant={typeVariants[annotation.type]}>
          {typeLabels[annotation.type]}
        </Badge>
        <p className="mt-2 text-sm">{annotation.text || "No description"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      <div className="flex gap-1">
        {(Object.keys(typeLabels) as AnnotationType[]).map((type) => (
          <button
            key={type}
            onClick={() => updateAnnotation(annotation.id, { type })}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              annotation.type === type
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>
      <Textarea
        value={annotation.text}
        onChange={(e) =>
          updateAnnotation(annotation.id, { text: e.target.value })
        }
        placeholder="Describe this annotation..."
        rows={3}
        className="text-sm"
      />
      <div className="flex justify-between">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            removeAnnotation(annotation.id);
            onClose();
          }}
        >
          Delete
        </Button>
        <Button size="sm" variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}
