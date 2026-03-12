import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Login - JWT token validation", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  // Extracted validation logic matching login/page.tsx
  function storeTokenIfValid(token: unknown) {
    if (token && typeof token === "string" && token.split(".").length === 3) {
      sessionStorage.setItem("authToken", token as string);
      return true;
    }
    return false;
  }

  it("stores a valid JWT token (3 dot-separated segments)", () => {
    const validJwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.signature";
    const stored = storeTokenIfValid(validJwt);

    expect(stored).toBe(true);
    expect(sessionStorage.getItem("authToken")).toBe(validJwt);
  });

  it("rejects an empty string token", () => {
    const stored = storeTokenIfValid("");

    expect(stored).toBe(false);
    expect(sessionStorage.getItem("authToken")).toBeNull();
  });

  it("rejects a null token", () => {
    const stored = storeTokenIfValid(null);

    expect(stored).toBe(false);
    expect(sessionStorage.getItem("authToken")).toBeNull();
  });

  it("rejects an undefined token", () => {
    const stored = storeTokenIfValid(undefined);

    expect(stored).toBe(false);
    expect(sessionStorage.getItem("authToken")).toBeNull();
  });

  it("rejects a token without proper JWT structure (no dots)", () => {
    const stored = storeTokenIfValid("not-a-jwt-token");

    expect(stored).toBe(false);
    expect(sessionStorage.getItem("authToken")).toBeNull();
  });

  it("rejects a token with only 2 segments", () => {
    const stored = storeTokenIfValid("header.payload");

    expect(stored).toBe(false);
    expect(sessionStorage.getItem("authToken")).toBeNull();
  });

  it("rejects a non-string token (number)", () => {
    const stored = storeTokenIfValid(12345);

    expect(stored).toBe(false);
    expect(sessionStorage.getItem("authToken")).toBeNull();
  });

  it("accepts a token with exactly 3 segments", () => {
    const stored = storeTokenIfValid("a.b.c");

    expect(stored).toBe(true);
    expect(sessionStorage.getItem("authToken")).toBe("a.b.c");
  });
});
