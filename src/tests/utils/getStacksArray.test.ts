import { describe, it, expect } from "vitest";
import { getStacksArray } from "@/utils";

/**
 * Tests for Bug #22: getStacksArray validation.
 * The fix filters out invalid entries like "NaN", "undefined", "null",
 * and empty strings.
 */

describe("getStacksArray", () => {
  it("returns empty array for undefined input", () => {
    expect(getStacksArray(undefined)).toEqual([]);
  });

  it("returns empty array for empty string input", () => {
    expect(getStacksArray("")).toEqual([]);
  });

  it("parses comma-separated string", () => {
    expect(getStacksArray("React, Vue, Angular")).toEqual([
      "React",
      "Vue",
      "Angular",
    ]);
  });

  it("handles string array input", () => {
    expect(getStacksArray(["React", "Vue"])).toEqual(["React", "Vue"]);
  });

  it("handles number array input", () => {
    expect(getStacksArray([1, 2, 3])).toEqual(["1", "2", "3"]);
  });

  it("trims whitespace from values", () => {
    expect(getStacksArray("  React ,  Vue  , Angular  ")).toEqual([
      "React",
      "Vue",
      "Angular",
    ]);
  });

  it("filters out empty entries from consecutive commas", () => {
    expect(getStacksArray("React,,Vue,,,Angular")).toEqual([
      "React",
      "Vue",
      "Angular",
    ]);
  });

  it("filters out 'NaN' string values", () => {
    expect(getStacksArray("React,NaN,Vue")).toEqual(["React", "Vue"]);
  });

  it("filters out 'undefined' string values", () => {
    expect(getStacksArray("React,undefined,Vue")).toEqual(["React", "Vue"]);
  });

  it("filters out 'null' string values", () => {
    expect(getStacksArray("React,null,Vue")).toEqual(["React", "Vue"]);
  });

  it("handles single value", () => {
    expect(getStacksArray("React")).toEqual(["React"]);
  });

  it("returns empty array when all values are invalid", () => {
    expect(getStacksArray("NaN,undefined,null,,")).toEqual([]);
  });
});
