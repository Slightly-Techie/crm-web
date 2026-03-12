import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock @/utils
vi.mock("@/utils", () => ({
  getTimeElapsedOrDate: () => "2 hours ago",
}));

import UserPost from "@/components/Feed/UserPost";

const makePost = (overrides: Partial<{ profile_pic_url: string }> = {}) => ({
  id: "1",
  content: "Hello world",
  feed_pic_url: "",
  created_at: "2024-01-01T00:00:00Z",
  user: {
    id: "42",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    profile_pic_url: overrides.profile_pic_url ?? "https://example.com/pic.jpg",
  },
});

describe("UserPost - profile pic URL logic", () => {
  it("renders profile image with valid URL", () => {
    render(<UserPost post={makePost()} />);
    const img = screen.getByAltText("profile") as HTMLImageElement;
    expect(img.src).toContain("example.com/pic.jpg");
  });

  it("uses fallback when profile_pic_url is the literal string 'string'", () => {
    render(<UserPost post={makePost({ profile_pic_url: "string" })} />);
    const img = screen.getByAltText("profile") as HTMLImageElement;
    expect(img.src).toContain("dicebear.com");
    expect(img.src).toContain("John");
  });

  it("uses fallback when profile_pic_url is empty string", () => {
    render(<UserPost post={makePost({ profile_pic_url: "" })} />);
    const img = screen.getByAltText("profile") as HTMLImageElement;
    expect(img.src).toContain("dicebear.com");
  });

  it("renders user name and username", () => {
    render(<UserPost post={makePost()} />);
    expect(screen.getByText(/John/)).toBeTruthy();
    expect(screen.getByText("@johndoe")).toBeTruthy();
  });

  it("renders post content", () => {
    render(<UserPost post={makePost()} />);
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  it("links to the techie profile page", () => {
    render(<UserPost post={makePost()} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/techies/42");
  });

  it("renders post image when feed_pic_url is present", () => {
    const post = {
      ...makePost(),
      feed_pic_url: "https://example.com/feed.jpg",
    };
    render(<UserPost post={post} />);
    const contentImg = screen.getByAltText("content-pic") as HTMLImageElement;
    expect(contentImg.src).toContain("feed.jpg");
  });

  it("does not render post image when feed_pic_url is empty", () => {
    render(<UserPost post={makePost()} />);
    expect(screen.queryByAltText("content-pic")).toBeNull();
  });
});
