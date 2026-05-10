"use client";

import { useState } from "react";
import type { SuggestedPerson, Review } from "@/lib/ai-report-types";
import { ReviewStatusCard } from "./review-status-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function PersonEditor({
  person,
  onSave,
  onCancel,
}: {
  person: SuggestedPerson;
  onSave: (p: SuggestedPerson) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(person);
  const [expertiseInput, setExpertiseInput] = useState("");

  function addExpertise(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (tag && !draft.expertise.includes(tag)) {
      setDraft({ ...draft, expertise: [...draft.expertise, tag] });
    }
    setExpertiseInput("");
  }

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Person</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={onCancel}>
            <X className="size-3" />
          </Button>
          <Button size="sm" className="h-6 px-1.5" onClick={() => onSave(draft)}>
            <Check className="size-3" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="Name"
          className="h-8 text-sm"
        />
        <Input
          value={draft.role}
          onChange={(e) => setDraft({ ...draft, role: e.target.value })}
          placeholder="Role"
          className="h-8 text-sm"
        />
      </div>
      <Textarea
        value={draft.reason}
        onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
        placeholder="Why should they be involved?"
        rows={2}
        className="text-sm"
      />
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {draft.expertise.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs gap-1">
              {tag}
              <button
                onClick={() =>
                  setDraft({
                    ...draft,
                    expertise: draft.expertise.filter((t) => t !== tag),
                  })
                }
              >
                <X className="size-2.5" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          value={expertiseInput}
          onChange={(e) => setExpertiseInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addExpertise(expertiseInput);
            }
          }}
          onBlur={() => {
            if (expertiseInput.trim()) addExpertise(expertiseInput);
          }}
          placeholder="Add expertise tag..."
          className="h-7 text-xs"
        />
      </div>
    </div>
  );
}

interface EditablePeoplePanelProps {
  reviewers: SuggestedPerson[];
  collaborators: SuggestedPerson[];
  reviews: Review[];
  onUpdateReviewers: (people: SuggestedPerson[]) => void;
  onUpdateCollaborators: (people: SuggestedPerson[]) => void;
}

export function EditablePeoplePanel({
  reviewers,
  collaborators,
  reviews,
  onUpdateReviewers,
  onUpdateCollaborators,
}: EditablePeoplePanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingReviewer, setEditingReviewer] = useState<number | null>(null);
  const [addingReviewer, setAddingReviewer] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<number | null>(null);
  const [addingCollaborator, setAddingCollaborator] = useState(false);

  const approvedCount = reviews.filter((r) => r.status === "approved").length;

  function renderPersonList(
    people: SuggestedPerson[],
    editingIdx: number | null,
    setEditingIdx: (idx: number | null) => void,
    onUpdate: (people: SuggestedPerson[]) => void,
    adding: boolean,
    setAdding: (v: boolean) => void,
    label: string
  ) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{label}</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setAdding(true)}
          >
            <Plus className="size-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {people.map((person, idx) =>
            editingIdx === idx ? (
              <PersonEditor
                key={idx}
                person={person}
                onSave={(p) => {
                  const updated = [...people];
                  updated[idx] = p;
                  onUpdate(updated);
                  setEditingIdx(null);
                }}
                onCancel={() => setEditingIdx(null)}
              />
            ) : (
              <div key={idx} className="group flex gap-3 rounded-lg border p-3">
                <Avatar>
                  <AvatarFallback>
                    {person.name ? initials(person.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm">{person.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {person.role}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {person.reason}
                  </p>
                  {person.expertise.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {person.expertise.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-1.5"
                    onClick={() => setEditingIdx(idx)}
                  >
                    <Pencil className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-1.5 text-destructive hover:text-destructive"
                    onClick={() => onUpdate(people.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            )
          )}
          {adding && (
            <PersonEditor
              person={{ name: "", role: "", reason: "", expertise: [] }}
              onSave={(p) => {
                onUpdate([...people, p]);
                setAdding(false);
              }}
              onCancel={() => setAdding(false)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-lg border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <Users className="size-5 text-blue-500" />
        <div className="flex-1">
          <h2 className="font-semibold">People</h2>
          <p className="text-xs text-muted-foreground font-normal">
            Who could act on these findings
          </p>
        </div>
        {reviews.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {approvedCount}/{reviews.length} reviewed
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
          {renderPersonList(
            reviewers,
            editingReviewer,
            setEditingReviewer,
            onUpdateReviewers,
            addingReviewer,
            setAddingReviewer,
            "Recommended Teammates"
          )}

          {reviews.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Review Status</h3>
              <div className="space-y-2">
                {reviews.map((review) => (
                  <ReviewStatusCard key={review.reviewer} review={review} />
                ))}
              </div>
            </div>
          )}

          {renderPersonList(
            collaborators,
            editingCollaborator,
            setEditingCollaborator,
            onUpdateCollaborators,
            addingCollaborator,
            setAddingCollaborator,
            "Could Also Help"
          )}
        </div>
      )}
    </section>
  );
}
