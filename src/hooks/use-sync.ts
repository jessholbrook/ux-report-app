"use client";

import { useEffect, useRef } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { listLocalReports, loadLocalReport } from "@/lib/local-storage";
import {
  saveReport,
  saveBlocks,
  saveAnnotations,
} from "@/hooks/use-report";

export function useSync() {
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user && !hasSynced.current) {
        hasSynced.current = true;
        await pushLocalReportsToSupabase(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}

async function pushLocalReportsToSupabase(userId: string) {
  const index = listLocalReports();
  for (const entry of index) {
    const stored = loadLocalReport(entry.id);
    if (!stored) continue;

    try {
      const report = { ...stored.report, owner_id: userId };
      await saveReport(report);

      if (stored.blocks.length > 0) {
        await saveBlocks(report.id, stored.blocks);
      }

      const blockIds = stored.blocks.map((b) => b.id);
      if (stored.annotations.length > 0 && blockIds.length > 0) {
        await saveAnnotations(blockIds, stored.annotations);
      }
    } catch (err) {
      console.error(`Failed to sync report ${entry.id}:`, err);
    }
  }
}
