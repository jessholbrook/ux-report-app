"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Debounced auto-save with two guarantees the naive version lacked:
 * - a pending save is flushed (not discarded) on unmount and on pagehide,
 *   so the last <500ms of edits survive navigation and tab close
 * - save failures (e.g. localStorage quota exceeded) surface as `saveFailed`
 *   instead of throwing uncaught inside the timer
 *
 * `value` must be referentially stable between edits (memoize composite
 * values), otherwise the debounce resets on every render.
 */
export function useAutoSave<T>(
  value: T,
  saveValue: (value: T) => boolean,
  enabled: boolean
) {
  const [saveFailed, setSaveFailed] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const pendingRef = useRef(false);
  const mountedRef = useRef(true);
  // Keep the latest value/saver in a ref so `flush` can stay stable while
  // always writing the newest edit.
  const latest = useRef({ value, saveValue });

  useEffect(() => {
    latest.current = { value, saveValue };
  });

  const flush = useCallback(() => {
    pendingRef.current = false;
    const ok = latest.current.saveValue(latest.current.value);
    if (!mountedRef.current) return; // still wrote to storage; skip setState
    setSaveFailed(!ok);
    if (ok) setLastSaved(new Date());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    pendingRef.current = true;
    const timeout = setTimeout(flush, 500);
    return () => clearTimeout(timeout);
  }, [value, enabled, flush]);

  useEffect(() => {
    mountedRef.current = true;
    const onHide = () => {
      if (pendingRef.current) flush();
    };
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      mountedRef.current = false;
      if (pendingRef.current) flush(); // write out any pending edit on unmount
    };
  }, [flush]);

  return { saveFailed, lastSaved };
}
