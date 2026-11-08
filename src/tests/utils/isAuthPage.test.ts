import { describe, it, expect } from "vitest";
import { isAuthPage } from "@/utils";

/**
 * Auth pages are always shown in the light theme (see providers.tsx).
 */

describe("isAuthPage", () => {
  it("matches the four auth pages", () => {
    expect(isAuthPage("/login")).toBe(true);
    expect(isAuthPage("/signup")).toBe(true);
    expect(isAuthPage("/users/forgot-password")).toBe(true);
    expect(isAuthPage("/users/reset-password/new-password")).toBe(true);
  });

  it("does not match app pages", () => {
    expect(isAuthPage("/")).toBe(false);
    expect(isAuthPage("/techies")).toBe(false);
    expect(isAuthPage("/settings")).toBe(false);
  });

  it("does not match paths that only start with the same letters", () => {
    expect(isAuthPage("/login-help")).toBe(false);
    expect(isAuthPage("/signups")).toBe(false);
  });

  it("returns false when there is no pathname", () => {
    expect(isAuthPage(null)).toBe(false);
  });
});
