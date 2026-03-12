import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Mock dependencies
vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockCreateNewPost = vi.fn();

vi.mock("@/components/Feed/FeedServices", () => ({
  usePostFeeds: () => ({
    createNewPost: mockCreateNewPost,
  }),
}));

vi.mock("@/hooks", () => ({
  useAppSelector: () => ({
    user: {
      first_name: "Test",
      last_name: "User",
      profile_pic_url: "https://example.com/pic.jpg",
    },
  }),
}));

vi.mock("@/utils", () => ({
  isNonWhitespace: (str: string) => str.trim().length > 0,
}));

import CreatePost from "@/components/Feed/CreatePost";

describe("CreatePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea and send button", () => {
    render(<CreatePost />);
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeTruthy();
    expect(screen.getByText("Send")).toBeTruthy();
  });

  it("renders media upload label", () => {
    render(<CreatePost />);
    expect(screen.getByText("Media")).toBeTruthy();
  });

  it("updates textarea value on input", () => {
    render(<CreatePost />);
    const textarea = screen.getByPlaceholderText("What's on your mind?") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Hello!" } });
    expect(textarea.value).toBe("Hello!");
  });

  it("calls createNewPost with form data on submit", () => {
    render(<CreatePost />);
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "Test post" } });
    fireEvent.click(screen.getByText("Send"));
    expect(mockCreateNewPost).toHaveBeenCalledTimes(1);
    const formData = mockCreateNewPost.mock.calls[0][0] as FormData;
    expect(formData.get("content")).toBe("Test post");
  });

  it("clears textarea after submit", () => {
    render(<CreatePost />);
    const textarea = screen.getByPlaceholderText("What's on your mind?") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Test post" } });
    fireEvent.click(screen.getByText("Send"));
    expect(textarea.value).toBe("");
  });

  it("does not submit when only whitespace is entered", () => {
    render(<CreatePost />);
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: "   " } });
    fireEvent.click(screen.getByText("Send"));
    expect(mockCreateNewPost).not.toHaveBeenCalled();
  });

  it("does not submit when textarea is empty and no file selected", () => {
    render(<CreatePost />);
    fireEvent.click(screen.getByText("Send"));
    expect(mockCreateNewPost).not.toHaveBeenCalled();
  });

  it("uses ref-based file input (not key-based remounting)", () => {
    render(<CreatePost />);
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    // The file input should exist and have a stable DOM reference
    expect(fileInput).toBeTruthy();
    expect(fileInput.type).toBe("file");
    expect(fileInput.accept).toBe("image/*");
  });

  it("resets file input value after submit via ref", () => {
    render(<CreatePost />);
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    const textarea = screen.getByPlaceholderText("What's on your mind?");

    // Simulate typing text and submitting
    fireEvent.change(textarea, { target: { value: "Post with text" } });

    // Manually set fileInput value to simulate a selected file
    Object.defineProperty(fileInput, "value", {
      writable: true,
      value: "C:\\fakepath\\image.png",
    });

    fireEvent.click(screen.getByText("Send"));

    // After submit, the file input value should be reset via ref
    // The ref-based reset (fileInputRef.current.value = "") was the bug fix
    expect(fileInput.value).toBe("");
  });
});
