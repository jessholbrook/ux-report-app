"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShareLink } from "./share-link";
import { useReport } from "@/contexts/report-context";

export function ShareDialog() {
  const { report, updateReportField } = useReport();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string[]>([]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    try {
      await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: report.id, email }),
      });
      setSent((prev) => [...prev, email]);
      setEmail("");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Public Link</Label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={report.is_public}
                  onChange={(e) =>
                    updateReportField("is_public", e.target.checked)
                  }
                />
                Make report public
              </label>
            </div>
            {report.is_public && <ShareLink shareToken={report.share_token} />}
          </div>

          <div className="space-y-2">
            <Label>Invite by Email</Label>
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="sm" disabled={sending}>
                Invite
              </Button>
            </form>
            {sent.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Invited: {sent.join(", ")}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
