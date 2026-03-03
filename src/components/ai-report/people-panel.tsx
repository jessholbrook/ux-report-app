"use client";

import { useState } from "react";
import type { SuggestedPerson, Review } from "@/lib/ai-report-types";
import { PersonCard } from "./person-card";
import { ReviewStatusCard } from "./review-status-card";
import { ChevronDown, ChevronRight, Users } from "lucide-react";

interface PeoplePanelProps {
  reviewers: SuggestedPerson[];
  collaborators: SuggestedPerson[];
  reviews: Review[];
}

export function PeoplePanel({
  reviewers,
  collaborators,
  reviews,
}: PeoplePanelProps) {
  const [expanded, setExpanded] = useState(true);

  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const totalCount = reviews.length;

  return (
    <section className="rounded-lg border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <Users className="size-5 text-blue-500" />
        <h2 className="font-semibold flex-1">People</h2>
        {totalCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {approvedCount}/{totalCount} reviewed
          </span>
        )}
        {expanded ? (
          <ChevronDown className="size-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-5">
          {/* Suggested Reviewers */}
          {reviewers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Suggested Reviewers</h3>
              <div className="space-y-2">
                {reviewers.map((person) => (
                  <PersonCard key={person.name} person={person} />
                ))}
              </div>
            </div>
          )}

          {/* Review Status */}
          {reviews.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Review Status</h3>
              <div className="space-y-2">
                {reviews.map((review) => (
                  <ReviewStatusCard
                    key={review.reviewer}
                    review={review}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Suggested Collaborators */}
          {collaborators.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Suggested Collaborators</h3>
              <div className="space-y-2">
                {collaborators.map((person) => (
                  <PersonCard key={person.name} person={person} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
