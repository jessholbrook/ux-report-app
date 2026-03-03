import type { Review } from "@/lib/ai-report-types";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MessageSquare } from "lucide-react";

const statusConfig: Record<
  Review["status"],
  { icon: typeof Check; label: string; className: string }
> = {
  approved: {
    icon: Check,
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  "changes-requested": {
    icon: MessageSquare,
    label: "Changes requested",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  },
};

export function ReviewStatusCard({ review }: { review: Review }) {
  const config = statusConfig[review.status];
  const Icon = config.icon;

  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <div className="pt-0.5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{review.reviewer}</span>
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        </div>
        {review.comment && (
          <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
        )}
        {review.reviewed_at && (
          <time className="mt-1 block text-xs text-muted-foreground/70">
            {new Date(review.reviewed_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}
      </div>
    </div>
  );
}
