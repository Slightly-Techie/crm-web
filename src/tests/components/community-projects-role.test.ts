import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Tests for Bug #23: community-projects page was using a manual useEffect
 * with raw axios to fetch user role. Fix: replaced with useQuery using
 * the existing getUserProfile service hook.
 */

const projectRoot = resolve(__dirname, "../..");

function readSource(relativePath: string): string {
  return readFileSync(resolve(projectRoot, relativePath), "utf-8");
}

describe("Community projects page - role fetching", () => {
  const source = readSource("app/(root)/community-projects/page.tsx");

  it("no longer imports axios directly", () => {
    // The page should use the service hook, not raw axios
    expect(source).not.toContain('import axios from "axios"');
  });

  it("no longer imports API_URL constant", () => {
    // No need for API_URL when using the service hook
    expect(source).not.toContain('import { API_URL }');
  });

  it("uses useQuery for role fetching instead of manual useEffect", () => {
    expect(source).toContain("useQuery");
    expect(source).toContain("getUserProfile");
  });

  it("uses useSession for auth check", () => {
    expect(source).toContain("useSession");
    expect(source).toContain('session.status === "authenticated"');
  });

  it("does not have manual fetchUserData function", () => {
    expect(source).not.toContain("fetchUserData");
  });

  it("fixes non-null assertion on filteredItems length", () => {
    // Should use nullish coalescing instead of non-null assertion
    expect(source).toContain("filteredItems?.length ?? 0");
    expect(source).not.toContain("filteredItems?.length!");
  });
});
