import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotFound from "@/app/not-found";

const { useSession } = vi.hoisted(() => ({ useSession: vi.fn() }));

vi.mock("next-auth/react", () => ({ useSession }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: vi.fn() }),
}));

describe("404 page", () => {
  it("links signed-in users back to the dashboard", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<NotFound />);

    const link = screen.getByRole("link", { name: /back to dashboard/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("links signed-out visitors to the login page", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<NotFound />);

    const link = screen.getByRole("link", { name: /go to login/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("offers a way back to the previous page", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<NotFound />);

    expect(
      screen.getByRole("button", { name: /go back/i })
    ).toBeInTheDocument();
  });
});
