import type { SuggestedPerson } from "@/lib/ai-report-types";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PersonCard({ person }: { person: SuggestedPerson }) {
  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <Avatar>
        {person.avatar_url && <AvatarImage src={person.avatar_url} alt={person.name} />}
        <AvatarFallback>{initials(person.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm">{person.name}</span>
          <span className="text-xs text-muted-foreground">{person.role}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{person.reason}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {person.expertise.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
