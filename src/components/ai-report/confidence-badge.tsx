import type { ConfidenceLevel } from "@/lib/ai-report-types";
import { Badge } from "@/components/ui/badge";

const config: Record<
  ConfidenceLevel,
  { label: string; className: string }
> = {
  high: {
    label: "High confidence",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  medium: {
    label: "Medium confidence",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  low: {
    label: "Low confidence",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const { label, className } = config[level];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
