import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { glob } from "glob";

describe("Performance: No console.log/error in production code", () => {
  it("source files do not contain active console.log or console.error statements", async () => {
    const srcFiles = glob.sync("src/**/*.{ts,tsx}", {
      ignore: [
        "src/tests/**",
        "src/utils/index.ts", // logToConsole utility is intentional
      ],
    });

    const violations: string[] = [];

    for (const file of srcFiles) {
      const content = fs.readFileSync(path.resolve(file), "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        // Skip commented-out lines (JS comments and JSX comments)
        if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*") || trimmed.startsWith("{/*")) {
          return;
        }
        if (
          trimmed.includes("console.log(") ||
          trimmed.includes("console.error(")
        ) {
          violations.push(`${file}:${index + 1}: ${trimmed}`);
        }
      });
    }

    expect(violations).toEqual([]);
  });
});
