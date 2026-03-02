"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setUser({ email: user.email });
        }
      } catch {
        // Supabase not configured — that's fine
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/reports/new">New Report</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/auth/login">Sign In</Link>
    </Button>
  );
}
