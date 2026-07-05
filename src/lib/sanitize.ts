import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize user-authored HTML before it reaches dangerouslySetInnerHTML.
 * Report content can arrive from contentEditable, imported JSON files, or
 * shared reports, so it must never carry scripts, event handlers, or
 * javascript: URLs.
 *
 * isomorphic-dompurify runs the same on the server (via jsdom) and the client,
 * so sanitized markup matches across SSR and hydration — a client-only
 * sanitizer would render "" on the server and cause a hydration mismatch.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
