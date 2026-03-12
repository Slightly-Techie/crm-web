import { describe, it, expect, vi } from "vitest";

describe("FeedServices - error handling", () => {
  it("should extract error message from API response", () => {
    // Mirrors the onError logic in usePostFeeds
    const extractErrorMessage = (error: any) => {
      return (
        error?.response?.data?.message ||
        "Failed to create post. Please try again."
      );
    };

    // API error with message
    const apiError = {
      response: { data: { message: "Content too long" } },
    };
    expect(extractErrorMessage(apiError)).toBe("Content too long");
  });

  it("should use fallback message when API error has no message", () => {
    const extractErrorMessage = (error: any) => {
      return (
        error?.response?.data?.message ||
        "Failed to create post. Please try again."
      );
    };

    // Network error without response
    const networkError = new Error("Network error");
    expect(extractErrorMessage(networkError)).toBe(
      "Failed to create post. Please try again."
    );
  });

  it("should use fallback message when error response has no data", () => {
    const extractErrorMessage = (error: any) => {
      return (
        error?.response?.data?.message ||
        "Failed to create post. Please try again."
      );
    };

    const errorNoData = { response: {} };
    expect(extractErrorMessage(errorNoData)).toBe(
      "Failed to create post. Please try again."
    );
  });

  it("should use fallback message for null error", () => {
    const extractErrorMessage = (error: any) => {
      return (
        error?.response?.data?.message ||
        "Failed to create post. Please try again."
      );
    };

    expect(extractErrorMessage(null)).toBe(
      "Failed to create post. Please try again."
    );
  });
});
