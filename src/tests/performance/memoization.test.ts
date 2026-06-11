import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Performance: Memoization fixes", () => {
  it("techies/[id]/page.tsx uses useMemo for recentPosts", () => {
    const filePath = path.resolve(
      "src/app/(root)/techies/[id]/page.tsx"
    );
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toContain("useMemo");
    expect(content).toMatch(/const recentPosts = useMemo\(\s*\(\)\s*=>/);
    expect(content).toMatch(/\[feedsData\?\.items,\s*userId\]/);
  });

  it("community-projects/page.tsx uses useMemo for filteredProjects", () => {
    const filePath = path.resolve(
      "src/app/(root)/community-projects/page.tsx"
    );
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toContain("useMemo");
    expect(content).toMatch(/const filteredProjects = useMemo\(\s*\(\)\s*=>/);
    expect(content).toMatch(/\[projectsData\?\.items,\s*selectedFilter\]/);
  });

  it("Member.tsx is wrapped with React.memo", () => {
    const filePath = path.resolve(
      "src/components/techies/Member.tsx"
    );
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toMatch(/export\s+default\s+React\.memo\(Member\)/);
  });
});
