# Fix plan — from project review (2026-07-03)

## P0 — Security
- [x] RLS: migration 002 replaces `FOR ALL` inherit-access policies on blocks/annotations with `FOR SELECT` (+ auth.jwt() email hardening)
- [x] XSS: sanitize `content.html` with DOMPurify at render (text-block, ai-report viewer/editor) and on JSON import
- [x] Open redirect: validate `next` param in auth callback

## P1 — Data loss
- [x] Auto-save: flush pending debounced save on unmount + pagehide (single shared useAutoSave hook)
- [x] localStorage quota: try/catch in both storage layers, `saveFailed` surfaced as visible error in toolbar
- [x] Report delete: window.confirm before permanent delete

## P3 — Quick correctness wins
- [x] moveBlock off-by-one when dragging down (extracted to pure moveBlockInList + tests)
- [x] Slider before/after labels swapped (verified visually in browser)
- [x] Pre-tags AI reports crash list/editor (default missing tags in page, editor, storage)
- [x] export-pdf: restore comparison modes in `finally`, attribute-based (no longer text/click-fragile)
- [x] Dynamic-import jspdf/html-to-image on click
- [x] Gate demo chat panel behind isDemo (+ "Simulated" badge, mobile width fix)
- [x] Fix all lint errors (empty interface, unused vars, set-state-in-effect)

## Safety net
- [x] vitest + tests: moveBlockInList, validateExportedReport, local-storage quota/round-trip, sanitizeHtml XSS
- [x] GitHub Actions CI: tsc, lint, test, build

## Review
Done in P0→P1→P3→safety-net order. Verified: `tsc --noEmit` clean, `eslint` clean,
20/20 tests pass, production build succeeds (14 routes), dev server renders demo with
no hydration/console/server errors.

### Notable decision / correction
- The render-time sanitizer initially returned "" during SSR, which caused a
  hydration mismatch (server "" vs client HTML). Switched dompurify →
  isomorphic-dompurify so server and client sanitize identically. Caught via
  browser console verification, not by tsc/lint/build.

### Deliberately deferred (larger, tracked for a follow-up)
- P2 strategic: finish the half-wired Supabase read path (/shared/[token],
  read-from-cloud) OR delete the dead sync/share code. Blocks nothing shipped here.
- Discriminated-union refactor of Block/AIReportSection (removes the `as BlockContent`
  cast in updateBlock and 8+ others).
- Image handling: downscale/compress on upload + move blobs to IndexedDB (the real
  fix behind the quota band-aid).
- Remaining a11y: annotation-pin color-only meaning/contrast, keyboard block reorder,
  "report not found" screen instead of silent redirect home.
- Server-render the two landing pages (kill blank-flash / SEO).
