import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Performance: Correct cache invalidation", () => {
  it("task-submission invalidates tasksubmission cache, not announcements", () => {
    const filePath = path.resolve(
      "src/app/(root)/(assesment)/assesment/[email]/components/task-submission.tsx"
    );
    const content = fs.readFileSync(filePath, "utf-8");
    const activeLines = content
      .split("\n")
      .filter((line) => !line.trimStart().startsWith("//"));

    const joined = activeLines.join("\n");

    expect(joined).toContain('queryKey: ["tasksubmission"]');
    expect(joined).not.toContain('queryKey: ["announcements"]');
  });
});
