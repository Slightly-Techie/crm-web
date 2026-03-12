import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Performance: Image optimization", () => {
  const filesToCheck = [
    {
      file: "src/components/techies/Member.tsx",
      shouldNotHavePriority: true,
    },
    {
      file: "src/components/layout/Navbar/index.tsx",
      shouldNotHavePriority: true,
    },
  ];

  for (const { file, shouldNotHavePriority } of filesToCheck) {
    describe(file, () => {
      it("does not request images larger than 100px", () => {
        const filePath = path.resolve(file);
        const content = fs.readFileSync(filePath, "utf-8");

        const dimensionMatches = Array.from(
          content.matchAll(/(?:width|height)=\{(\d+)\}/g)
        );

        for (const match of dimensionMatches) {
          const value = parseInt(match[1], 10);
          expect(value).toBeLessThanOrEqual(100);
        }
      });

      if (shouldNotHavePriority) {
        it("does not set priority={true} on list item images", () => {
          const filePath = path.resolve(file);
          const content = fs.readFileSync(filePath, "utf-8");

          expect(content).not.toMatch(/priority=\{true\}/);
        });
      }
    });
  }

  it("UserPost.tsx profile image uses appropriate dimensions", () => {
    const filePath = path.resolve("src/components/Feed/UserPost.tsx");
    const content = fs.readFileSync(filePath, "utf-8");

    // The profile image (w-12 h-12 = 48px) should not use 1000px dimensions
    // But the content/feed image can be larger
    expect(content).not.toMatch(/priority=\{true\}/);

    // Find the profile image section (before the content section)
    const profileSection = content.split("post.feed_pic_url")[0];
    const dimensions = Array.from(
      profileSection.matchAll(/(?:width|height)=\{(\d+)\}/g)
    );

    for (const match of dimensions) {
      const value = parseInt(match[1], 10);
      expect(value).toBeLessThanOrEqual(100);
    }
  });
});
