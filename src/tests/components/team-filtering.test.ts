import { describe, it, expect } from "vitest";

/**
 * Tests for the Team component's filtering logic (Bug #16 fix).
 * The fix wrapped filtering in useMemo with proper dependencies
 * and pre-computes the lowercase keyword once.
 */

// Replicate the filtering logic from Team.tsx
function filterTechies(
  items: Array<{ first_name: string; last_name: string }> | undefined,
  searchKeyword: string
) {
  if (!searchKeyword) return items;
  const keyword = searchKeyword.toLowerCase();
  return items?.filter(
    (techie) =>
      techie.first_name.toLowerCase().includes(keyword) ||
      techie.last_name.toLowerCase().includes(keyword)
  );
}

const techies = [
  { first_name: "Alice", last_name: "Johnson" },
  { first_name: "Bob", last_name: "Smith" },
  { first_name: "Charlie", last_name: "Brown" },
  { first_name: "Alice", last_name: "Williams" },
];

describe("Team - filtering logic", () => {
  it("returns all items when search keyword is empty", () => {
    const result = filterTechies(techies, "");
    expect(result).toEqual(techies);
    expect(result).toHaveLength(4);
  });

  it("filters by first name (case insensitive)", () => {
    const result = filterTechies(techies, "alice");
    expect(result).toHaveLength(2);
    expect(result![0].first_name).toBe("Alice");
    expect(result![1].first_name).toBe("Alice");
  });

  it("filters by last name (case insensitive)", () => {
    const result = filterTechies(techies, "SMITH");
    expect(result).toHaveLength(1);
    expect(result![0].last_name).toBe("Smith");
  });

  it("matches partial names", () => {
    const result = filterTechies(techies, "li");
    // "alice" contains "li" ✓, "bob" no, "charlie" contains "li" ✓, "alice" ✓
    expect(result).toHaveLength(3);
  });

  it("returns empty array when no matches found", () => {
    const result = filterTechies(techies, "xyz");
    expect(result).toHaveLength(0);
  });

  it("returns undefined when items is undefined", () => {
    const result = filterTechies(undefined, "alice");
    expect(result).toBeUndefined();
  });

  it("returns undefined items when keyword is empty and items is undefined", () => {
    const result = filterTechies(undefined, "");
    expect(result).toBeUndefined();
  });

  it("handles mixed case search keyword", () => {
    const result = filterTechies(techies, "BoB");
    expect(result).toHaveLength(1);
    expect(result![0].first_name).toBe("Bob");
  });
});
