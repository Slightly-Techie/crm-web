import { describe, it, expect } from "vitest";

/**
 * Tests for Bug #18: Old React Query v4 invalidation syntax.
 *
 * In TanStack React Query v4, invalidateQueries requires an object
 * with queryKey, not a plain array:
 *   ✗ queryClient.invalidateQueries(["feed-data"])
 *   ✓ queryClient.invalidateQueries({ queryKey: ["feed-data"] })
 *
 * We verify the files have been updated by checking the source code
 * contains the correct syntax pattern.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const projectRoot = resolve(__dirname, "../..");

function readSource(relativePath: string): string {
  return readFileSync(resolve(projectRoot, relativePath), "utf-8");
}

describe("invalidateQueries syntax - React Query v4 compliance", () => {
  const filesToCheck = [
    "components/Feed/FeedServices.tsx",
    "services/AnnouncementServices.tsx",
    "app/(root)/(assesment)/assesment/[email]/components/task-submission.tsx",
    "app/(root)/community-projects/[id]/page.tsx",
  ];

  filesToCheck.forEach((filePath) => {
    it(`${filePath} uses object syntax for invalidateQueries`, () => {
      const source = readSource(filePath);

      // Check that the file contains the correct object syntax
      if (source.includes("invalidateQueries")) {
        // Should use { queryKey: [...] } syntax
        expect(source).toContain("invalidateQueries({ queryKey:");

        // Should NOT use the old array-only syntax in uncommented code
        // Strip comments before checking
        const uncommentedLines = source
          .split("\n")
          .filter((line) => !line.trimStart().startsWith("//"))
          .join("\n");
        const oldSyntaxPattern = /invalidateQueries\(\[/;
        expect(oldSyntaxPattern.test(uncommentedLines)).toBe(false);
      }
    });
  });
});
