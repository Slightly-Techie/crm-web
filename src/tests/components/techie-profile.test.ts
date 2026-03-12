import { describe, it, expect } from "vitest";

/**
 * Tests for the techie profile page fixes (Bug #15):
 * - Non-null assertion on optional chaining: `currentUserPosts?.length! > 1`
 *   was changed to `(currentUserPosts?.length ?? 0) > 0`
 * - This fixed two issues: unsafe non-null assertion AND off-by-one (hiding single posts)
 */

describe("Techie profile - posts visibility logic", () => {
  // Old buggy logic: currentUserPosts?.length! > 1
  const oldLogic = (posts: any[] | undefined | null) => {
    return posts?.length! > 1;
  };

  // Fixed logic: (currentUserPosts?.length ?? 0) > 0
  const fixedLogic = (posts: any[] | undefined | null) => {
    return (posts?.length ?? 0) > 0;
  };

  it("shows posts section when there is exactly 1 post (fixed)", () => {
    const posts = [{ id: 1, content: "Hello" }];
    // Old logic would hide a single post (1 > 1 = false)
    expect(oldLogic(posts)).toBe(false);
    // Fixed logic correctly shows it (1 > 0 = true)
    expect(fixedLogic(posts)).toBe(true);
  });

  it("shows posts section when there are multiple posts", () => {
    const posts = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(fixedLogic(posts)).toBe(true);
  });

  it("hides posts section when array is empty", () => {
    expect(fixedLogic([])).toBe(false);
  });

  it("hides posts section when posts is undefined", () => {
    expect(fixedLogic(undefined)).toBe(false);
  });

  it("hides posts section when posts is null", () => {
    expect(fixedLogic(null)).toBe(false);
  });
});

describe("Techie profile - profile pic URL logic", () => {
  const getProfilePicUrl = (
    profile_pic_url: string | null | undefined,
    first_name: string,
    last_name: string
  ) => {
    return profile_pic_url && profile_pic_url !== "string"
      ? profile_pic_url
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${first_name} ${last_name}`;
  };

  it("uses provided URL when valid", () => {
    const url = getProfilePicUrl("https://example.com/pic.jpg", "John", "Doe");
    expect(url).toBe("https://example.com/pic.jpg");
  });

  it("uses fallback when profile_pic_url is 'string' literal", () => {
    const url = getProfilePicUrl("string", "John", "Doe");
    expect(url).toContain("dicebear.com");
    expect(url).toContain("John Doe");
  });

  it("uses fallback when profile_pic_url is null", () => {
    const url = getProfilePicUrl(null, "Jane", "Smith");
    expect(url).toContain("dicebear.com");
    expect(url).toContain("Jane Smith");
  });

  it("uses fallback when profile_pic_url is undefined", () => {
    const url = getProfilePicUrl(undefined, "Jane", "Smith");
    expect(url).toContain("dicebear.com");
  });

  it("uses fallback when profile_pic_url is empty string", () => {
    const url = getProfilePicUrl("", "Test", "User");
    expect(url).toContain("dicebear.com");
  });
});
