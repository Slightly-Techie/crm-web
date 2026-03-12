import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Performance: Memoization fixes", () => {
  it("techies/[id]/page.tsx uses useMemo for currentUserPosts", () => {
    const filePath = path.resolve(
      "src/app/(root)/techies/[id]/page.tsx"
    );
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toContain("useMemo");
    expect(content).toMatch(/useMemo\(\s*\(\)\s*=>\s*FeedPosts\?\.filter/);
    expect(content).toMatch(/\[FeedPosts,\s*UserProfile\?\.id\]/);
  });

  it("community-projects/page.tsx uses useMemo for filteredItems", () => {
    const filePath = path.resolve(
      "src/app/(root)/community-projects/page.tsx"
    );
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toContain("useMemo");
    expect(content).toMatch(/useMemo\(\s*\(\)\s*=>/);
    expect(content).toMatch(/\[projectList,\s*query,\s*selectedFilter\]/);
  });

  it("Member.tsx is wrapped with React.memo", () => {
    const filePath = path.resolve(
      "src/components/techies/Member.tsx"
    );
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toMatch(/export\s+default\s+React\.memo\(Member\)/);
  });
});
