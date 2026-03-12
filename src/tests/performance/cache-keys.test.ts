import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Performance: Standardized cache keys", () => {
  const files = [
    "src/components/layout/Navbar/index.tsx",
    "src/app/(root)/announcements/page.tsx",
    "src/app/(root)/community-projects/page.tsx",
    "src/app/(root)/techie/me/page.tsx",
  ];

  it("all user profile queries use the standardized 'userProfile' cache key", () => {
    for (const file of files) {
      const filePath = path.resolve(file);
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");

      // Find all queryKey lines that relate to user profile
      const queryKeyLines = lines.filter(
        (line) =>
          line.includes("queryKey:") &&
          (line.includes("userProfile") || line.includes("user_profile"))
      );

      for (const line of queryKeyLines) {
        // Should use "userProfile", not "user_profile"
        expect(line).not.toContain('"user_profile"');
        expect(line).toContain('"userProfile"');
      }
    }
  });

  it("Navbar does not have a duplicate user profile query", () => {
    const filePath = path.resolve("src/components/layout/Navbar/index.tsx");
    const content = fs.readFileSync(filePath, "utf-8");

    // Count occurrences of useQuery({ — should only have one for userProfile
    const useQueryMatches = content.match(/useQuery\(\{/g);
    // The Navbar should have exactly 1 useQuery call now (the userProfile one)
    expect(useQueryMatches?.length).toBe(1);
  });
});
