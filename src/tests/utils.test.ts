import { test, expect } from "@playwright/test";
import { getSkillsArray } from "../utils/index";
import { REGEXVALIDATION } from "../constants/index";

test("skills regexp", async () => {
  expect(
    REGEXVALIDATION.listSeparatedByComma.test("nodejs, c#, java, flutter")
  ).toBe(true);
  expect(
    REGEXVALIDATION.listSeparatedByComma.test(
      "PYTHON,DJANGO,javaScript, React Native"
    )
  ).toBe(true);
  expect(
    REGEXVALIDATION.listSeparatedByComma.test("c, c++, zig, Spring Boot")
  ).toBe(true);
  expect(REGEXVALIDATION.listSeparatedByComma.test("")).toBe(false);
});

test("utility function", async ({}) => {
  expect(getSkillsArray("javascript, ruby, python,django")).toStrictEqual([
    "javascript",
    "ruby",
    "python",
    "django",
  ]);
});
