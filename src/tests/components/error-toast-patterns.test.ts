import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Tests for Bug #25: Inconsistent error toast patterns.
 * Verifies that all useMutation calls have onError callbacks
 * with toast notifications (not just console.error).
 */

const projectRoot = resolve(__dirname, "../..");

function readSource(relativePath: string): string {
  return readFileSync(resolve(projectRoot, relativePath), "utf-8");
}

// Strip comment blocks and single-line comments
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("//"))
    .join("\n");
}

describe("Error toast patterns - mutation error handling", () => {
  const mutationFiles = [
    {
      file: "services/AnnouncementServices.tsx",
      description: "AnnouncementServices mutations",
    },
    {
      file: "app/(root)/community-projects/[id]/page.tsx",
      description: "Project delete mutation",
    },
    {
      file: "app/(admin)/admin/add-project/page.tsx",
      description: "Project create mutation",
    },
    {
      file: "components/Feed/FeedServices.tsx",
      description: "Feed post mutation",
    },
    {
      file: "app/(root)/(assesment)/assesment/[email]/components/task-submission.tsx",
      description: "Task submission mutation",
    },
  ];

  mutationFiles.forEach(({ file, description }) => {
    it(`${description} has toast error handling`, () => {
      const source = readSource(file);
      const uncommented = stripComments(source);

      // If file has useMutation, it should have onError with toast
      if (uncommented.includes("useMutation")) {
        expect(uncommented).toContain("onError");
        expect(uncommented).toContain("toast.error");
      }
    });
  });

  it("AnnouncementServices imports toast", () => {
    const source = readSource("services/AnnouncementServices.tsx");
    expect(source).toContain('import toast from "react-hot-toast"');
  });

  it("community-projects detail page imports toast", () => {
    const source = readSource("app/(root)/community-projects/[id]/page.tsx");
    expect(source).toContain('import toast from "react-hot-toast"');
  });

  it("add-project page imports toast", () => {
    const source = readSource("app/(admin)/admin/add-project/page.tsx");
    expect(source).toContain('import toast from "react-hot-toast"');
  });
});
