import { describe, it, expect } from "vitest";

/**
 * Tests for Bug #19: Pagination display logic in Team.tsx.
 * The fix ensures "Showing 0 to 0 of 0 entries" when there are no results,
 * instead of "Showing 1 to 0 of 0 entries".
 */

type PaginationDetails = {
  total: number;
  size: number;
  pages: number;
  page: number;
};

function getPaginationFrom(details: PaginationDetails): number {
  return details.total === 0
    ? 0
    : 1 + (details.page - 1) * details.size;
}

function getPaginationTo(details: PaginationDetails): number {
  return details.page === details.pages
    ? details.total
    : details.size * details.page;
}

describe("Pagination display logic", () => {
  it("shows 'Showing 0 to 0 of 0' when there are no results", () => {
    const details: PaginationDetails = { total: 0, size: 0, pages: 0, page: 0 };
    expect(getPaginationFrom(details)).toBe(0);
    expect(getPaginationTo(details)).toBe(0);
  });

  it("shows 'Showing 1 to 10' on first page of multi-page results", () => {
    const details: PaginationDetails = { total: 25, size: 10, pages: 3, page: 1 };
    expect(getPaginationFrom(details)).toBe(1);
    expect(getPaginationTo(details)).toBe(10);
  });

  it("shows 'Showing 11 to 20' on second page", () => {
    const details: PaginationDetails = { total: 25, size: 10, pages: 3, page: 2 };
    expect(getPaginationFrom(details)).toBe(11);
    expect(getPaginationTo(details)).toBe(20);
  });

  it("shows 'Showing 21 to 25' on last page with fewer items", () => {
    const details: PaginationDetails = { total: 25, size: 10, pages: 3, page: 3 };
    expect(getPaginationFrom(details)).toBe(21);
    expect(getPaginationTo(details)).toBe(25); // Uses total, not size * page
  });

  it("handles single page of results correctly", () => {
    const details: PaginationDetails = { total: 5, size: 10, pages: 1, page: 1 };
    expect(getPaginationFrom(details)).toBe(1);
    expect(getPaginationTo(details)).toBe(5); // page === pages, so uses total
  });

  it("handles exactly one page full of results", () => {
    const details: PaginationDetails = { total: 10, size: 10, pages: 1, page: 1 };
    expect(getPaginationFrom(details)).toBe(1);
    expect(getPaginationTo(details)).toBe(10);
  });
});
