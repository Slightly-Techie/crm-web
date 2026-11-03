import { describe, it, expect } from "vitest";
import { formatYears } from "@/utils";

/**
 * Years of experience used to render as "1 Years", and 0 as "Not specified".
 */

describe("formatYears", () => {
  it("uses the singular for one year", () => {
    expect(formatYears(1)).toBe("1 year");
  });

  it("uses the plural for more than one year", () => {
    expect(formatYears(5)).toBe("5 years");
  });

  it("shows zero as less than a year", () => {
    expect(formatYears(0)).toBe("Less than a year");
  });

  it("shows missing values as not specified", () => {
    expect(formatYears(null)).toBe("Not specified");
    expect(formatYears(undefined)).toBe("Not specified");
  });
});
