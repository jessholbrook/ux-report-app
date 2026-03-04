import type { AIReport } from "@/lib/ai-report-types";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Bot, Calendar, Clock, Hash, Zap } from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const statusStyles: Record<AIReport["status"], string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "in-review":
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  published:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
};

export function ReportHero({ report }: { report: AIReport }) {
  return (
    <div className="space-y-4">
      {/* Status + version */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={statusStyles[report.status]}>
          {report.status.replace("-", " ")}
        </Badge>
        <span className="text-xs text-muted-foreground">
          v{report.version}
        </span>
      </div>

      {/* Title + summary */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          {report.summary}
        </p>

        {report.human_hours_estimate != null && report.ai_minutes_actual != null && (
          <div className="mt-3 flex items-center gap-4 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Manual estimate: {report.human_hours_estimate}h
            </span>
            <span className="text-muted-foreground/40">|</span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5" />
              AI-assisted: {report.ai_minutes_actual >= 60
                ? `${Math.round(report.ai_minutes_actual / 60)}h`
                : `${report.ai_minutes_actual}m`}
            </span>
            <span className="text-muted-foreground/40">|</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {Math.round((1 - report.ai_minutes_actual / (report.human_hours_estimate * 60)) * 100)}% faster
            </span>
          </div>
        )}
      </div>

      {/* Meta bar */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {/* Authors */}
        <div className="flex items-center gap-2">
          <AvatarGroup>
            {report.authors.map((author) => (
              <Avatar key={author.name} size="sm">
                {author.avatar_url && (
                  <AvatarImage src={author.avatar_url} alt={author.name} />
                )}
                <AvatarFallback>{initials(author.name)}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <span>
            {report.authors.map((a) => a.name).join(", ")}
          </span>
        </div>

        <span className="text-muted-foreground/40">|</span>

        {/* AI Contributors */}
        <div className="flex items-center gap-1.5">
          <Bot className="size-4" />
          <span>
            {report.ai_contributors.map((c) => c.model_name).join(", ")}
          </span>
        </div>

        <span className="text-muted-foreground/40">|</span>

        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          <time>
            {new Date(report.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Hash className="size-3.5 text-muted-foreground" />
        {report.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
