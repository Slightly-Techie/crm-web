import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ForgotPassword from "@/app/users/forgot-password/page";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("@/lib/axios", () => ({
  default: { post },
}));

const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

async function submitEmail(email: string) {
  render(<ForgotPassword />);
  await userEvent.type(screen.getByLabelText(/email address/i), email);
  await userEvent.click(
    screen.getByRole("button", { name: /send reset link/i })
  );
}

describe("Forgot password page", () => {
  beforeEach(() => {
    post.mockReset();
    // The API returns the same 200 response whether or not the account exists.
    post.mockResolvedValue({ data: { message: GENERIC_MESSAGE } });
  });

  it("shows the generic message after submitting", async () => {
    await submitEmail("someone@example.com");

    await waitFor(() => {
      expect(screen.getByText(GENERIC_MESSAGE)).toBeInTheDocument();
    });
  });

  it("does not claim the email has an account", async () => {
    await submitEmail("someone@example.com");

    await waitFor(() => {
      expect(screen.getByText(GENERIC_MESSAGE)).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/has been sent to your email address/i)
    ).not.toBeInTheDocument();
  });
});
