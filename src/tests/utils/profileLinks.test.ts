import { describe, it, expect } from "vitest";
import { toProfileLink } from "@/utils/profileLinks";

describe("toProfileLink", () => {
  it.each([
    ["ransfordgenesis", "https://github.com/ransfordgenesis"],
    ["@ransfordgenesis", "https://github.com/ransfordgenesis"],
    ["  ransfordgenesis  ", "https://github.com/ransfordgenesis"],
    ["github.com/ransfordgenesis", "https://github.com/ransfordgenesis"],
    [
      "www.github.com/ransfordgenesis",
      "https://www.github.com/ransfordgenesis",
    ],
    [
      "https://github.com/ransfordgenesis",
      "https://github.com/ransfordgenesis",
    ],
  ])("GitHub accepts %j", (value, expected) => {
    expect(toProfileLink("github_profile", value)).toBe(expected);
  });

  it.each([
    "javascript:alert(1)",
    "https://evil.com/ransfordgenesis",
    "github.com",
    "https://github.com/",
    "not a username",
    "-starts-with-hyphen",
  ])("GitHub rejects %j", (value) => {
    expect(toProfileLink("github_profile", value)).toBeNull();
  });

  it.each([
    ["kobi_ampem", "https://x.com/kobi_ampem"],
    ["@kobi_ampem", "https://x.com/kobi_ampem"],
    ["x.com/kobi_ampem", "https://x.com/kobi_ampem"],
    ["https://twitter.com/kobi_ampem", "https://twitter.com/kobi_ampem"],
  ])("X accepts %j", (value, expected) => {
    expect(toProfileLink("twitter_profile", value)).toBe(expected);
  });

  it("X rejects a link to another site", () => {
    expect(toProfileLink("twitter_profile", "github.com/kobi")).toBeNull();
  });

  it.each([
    ["kobi-ampem", "https://www.linkedin.com/in/kobi-ampem"],
    ["linkedin.com/in/kobi-ampem", "https://linkedin.com/in/kobi-ampem"],
    [
      "https://gh.linkedin.com/in/kobi-ampem",
      "https://gh.linkedin.com/in/kobi-ampem",
    ],
  ])("LinkedIn accepts %j", (value, expected) => {
    expect(toProfileLink("linkedin_profile", value)).toBe(expected);
  });

  it("LinkedIn rejects a look-alike host", () => {
    expect(
      toProfileLink("linkedin_profile", "notlinkedin.com/in/kobi")
    ).toBeNull();
  });

  it.each([
    ["alice.dev", "https://alice.dev"],
    ["https://alice.dev/work", "https://alice.dev/work"],
    ["http://alice.dev", "http://alice.dev"],
  ])("portfolio accepts %j", (value, expected) => {
    expect(toProfileLink("portfolio_url", value)).toBe(expected);
  });

  it.each(["alice", "javascript:alert(1)", "data:text/html,hi", "https://"])(
    "portfolio rejects %j",
    (value) => {
      expect(toProfileLink("portfolio_url", value)).toBeNull();
    }
  );

  it.each(["", "   ", undefined, null])("empty %j stays empty", (value) => {
    expect(toProfileLink("github_profile", value)).toBe("");
  });
});
