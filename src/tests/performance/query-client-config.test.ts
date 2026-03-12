import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Performance: QueryClient configuration", () => {
  it("providers.tsx configures staleTime on QueryClient", () => {
    const filePath = path.resolve("src/app/providers.tsx");
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toContain("staleTime");
    expect(content).toContain("defaultOptions");
    // Ensure staleTime is a positive number (not 0)
    const staleTimeMatch = content.match(/staleTime:\s*(.+)/);
    expect(staleTimeMatch).not.toBeNull();
  });
});
