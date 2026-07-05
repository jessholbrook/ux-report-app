import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it("keeps benign formatting markup", () => {
    const html = "<p>Hello <strong>world</strong></p>";
    expect(sanitizeHtml(html)).toBe(html);
  });

  it("strips inline event handlers (XSS vector)", () => {
    const out = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(out).not.toContain("onerror");
    expect(out).not.toContain("alert");
  });

  it("removes <script> tags", () => {
    const out = sanitizeHtml('<p>ok</p><script>steal(document.cookie)</script>');
    expect(out).not.toContain("<script");
    expect(out).toContain("<p>ok</p>");
  });

  it("neutralizes javascript: URLs", () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(out).not.toContain("javascript:");
  });
});
