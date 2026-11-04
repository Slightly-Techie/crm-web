/* eslint-disable no-script-url -- these tests check that javascript: links are blocked */
import { describe, it, expect } from "vitest";
import { toSafeUrl } from "@/utils";

/**
 * Profile links are used as hrefs. Links saved without a scheme became
 * relative links on our own site, and "javascript:" links would run code.
 */

describe("toSafeUrl", () => {
  it("adds https:// to a link without a scheme", () => {
    expect(toSafeUrl("github.com/a")).toBe("https://github.com/a");
  });

  it("keeps http and https links unchanged", () => {
    expect(toSafeUrl("https://x.com/a")).toBe("https://x.com/a");
    expect(toSafeUrl("http://example.com")).toBe("http://example.com");
    expect(toSafeUrl("HTTPS://X.COM/a")).toBe("HTTPS://X.COM/a");
  });

  it("returns undefined for javascript: links in any case", () => {
    expect(toSafeUrl("javascript:alert(1)")).toBeUndefined();
    expect(toSafeUrl("JavaScript:alert(1)")).toBeUndefined();
  });

  it("returns undefined when tabs or newlines hide a javascript: link", () => {
    expect(toSafeUrl("java\tscript:alert(1)")).toBeUndefined();
    expect(toSafeUrl("java\nscript:alert(1)")).toBeUndefined();
  });

  it("returns undefined for other schemes", () => {
    expect(toSafeUrl("mailto:someone@example.com")).toBeUndefined();
    expect(toSafeUrl("data:text/html,hello")).toBeUndefined();
  });

  it("treats a colon followed by a port as part of the address", () => {
    expect(toSafeUrl("github.com:443/a")).toBe("https://github.com:443/a");
  });

  it("adds https: to a protocol-relative link", () => {
    expect(toSafeUrl("//example.com/me")).toBe("https://example.com/me");
  });

  it("trims spaces", () => {
    expect(toSafeUrl("  github.com/a  ")).toBe("https://github.com/a");
  });

  it("returns undefined for empty values", () => {
    expect(toSafeUrl("")).toBeUndefined();
    expect(toSafeUrl("   ")).toBeUndefined();
    expect(toSafeUrl(null)).toBeUndefined();
    expect(toSafeUrl(undefined)).toBeUndefined();
  });
});
