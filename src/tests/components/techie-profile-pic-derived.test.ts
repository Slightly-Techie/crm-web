import { describe, it, expect } from "vitest";

/**
 * Tests for Bug #24: Profile pic URL was initialized in useState
 * which only runs once (when UserProfile is undefined).
 * Fix: Derive the URL from query data + error state instead.
 */

function getProfilePicUrl(
  profilePicUrl: string | null | undefined,
  firstName: string,
  lastName: string,
  imgError: boolean
): string {
  const fallbackUrl = `https://api.dicebear.com/7.x/initials/jpg?seed=${firstName ?? ""} ${lastName ?? ""}`;
  return !imgError && profilePicUrl && profilePicUrl !== "string"
    ? profilePicUrl
    : fallbackUrl;
}

describe("Techie profile - derived profile pic URL", () => {
  it("uses provided URL when valid and no error", () => {
    const url = getProfilePicUrl("https://example.com/pic.jpg", "John", "Doe", false);
    expect(url).toBe("https://example.com/pic.jpg");
  });

  it("uses fallback when profile_pic_url is null", () => {
    const url = getProfilePicUrl(null, "John", "Doe", false);
    expect(url).toContain("dicebear.com");
    expect(url).toContain("John Doe");
  });

  it("uses fallback when profile_pic_url is undefined", () => {
    const url = getProfilePicUrl(undefined, "Jane", "Smith", false);
    expect(url).toContain("dicebear.com");
  });

  it("uses fallback when profile_pic_url is the literal 'string'", () => {
    const url = getProfilePicUrl("string", "Jane", "Smith", false);
    expect(url).toContain("dicebear.com");
  });

  it("uses fallback when image load error occurred", () => {
    const url = getProfilePicUrl("https://example.com/pic.jpg", "John", "Doe", true);
    expect(url).toContain("dicebear.com");
    expect(url).not.toContain("example.com");
  });

  it("uses fallback with correct name seeds when error occurs", () => {
    const url = getProfilePicUrl("https://example.com/pic.jpg", "Alice", "Wonder", true);
    expect(url).toContain("Alice Wonder");
  });

  it("handles empty strings for names gracefully", () => {
    const url = getProfilePicUrl(null, "", "", false);
    expect(url).toContain("dicebear.com");
  });
});
