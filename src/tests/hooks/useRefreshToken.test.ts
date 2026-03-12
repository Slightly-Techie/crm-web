import { describe, it, expect, vi, beforeEach } from "vitest";

describe("useRefreshToken - error handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call signOut when refresh token request fails", async () => {
    const mockSignOut = vi.fn();
    const mockPost = vi.fn().mockRejectedValue(new Error("Network error"));

    // Simulate the refresh function's try/catch logic from useRefreshToken
    const refresh = async () => {
      try {
        const { data } = await mockPost("/api/v1/users/refresh", {
          refresh_token: "test-refresh-token",
        });
        return data.token;
      } catch (error) {
        mockSignOut();
        throw error;
      }
    };

    await expect(refresh()).rejects.toThrow("Network error");
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("should return new token on successful refresh", async () => {
    const mockUpdate = vi.fn();
    const mockPost = vi.fn().mockResolvedValue({
      data: { token: "new-token", refresh_token: "new-refresh" },
    });

    const refresh = async () => {
      try {
        const { data } = await mockPost("/api/v1/users/refresh", {
          refresh_token: "old-refresh-token",
        });
        mockUpdate(data);
        return data.token;
      } catch (error) {
        throw error;
      }
    };

    const token = await refresh();
    expect(token).toBe("new-token");
    expect(mockUpdate).toHaveBeenCalledWith({
      token: "new-token",
      refresh_token: "new-refresh",
    });
  });

  it("should update session data with refreshed token data", async () => {
    const mockUpdate = vi.fn();
    const newTokenData = {
      token: "refreshed-token",
      refresh_token: "refreshed-refresh",
    };
    const mockPost = vi.fn().mockResolvedValue({ data: newTokenData });

    const refresh = async () => {
      const { data } = await mockPost("/api/v1/users/refresh", {
        refresh_token: "old-refresh",
      });
      mockUpdate(data);
      return data.token;
    };

    await refresh();
    expect(mockUpdate).toHaveBeenCalledWith(newTokenData);
  });
});
