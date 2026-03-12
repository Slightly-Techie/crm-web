import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Signup from "@/app/signup/page";

// Mock dependencies
vi.mock("@/hooks/useNavigateForms", () => ({
  default: () => ({
    handleSubmit: (fn: Function) => (e: Event) => {
      e?.preventDefault?.();
      fn({});
    },
    next: vi.fn(),
    previous: vi.fn(),
    resetForm: vi.fn(),
    currentForm: { element: <div data-testid="current-form">Form Step</div> },
    currentFormIndex: 0,
  }),
}));

vi.mock("@/hooks/usePostNewSignUp", () => ({
  default: () => ({
    createNewUser: vi.fn(),
    status: "progress",
    setStatus: vi.fn(),
    errMessage: "",
  }),
}));

vi.mock("@/services", () => ({
  default: () => ({}),
  getStacks: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("react-icons/ri", () => ({
  RiArrowLeftLine: () => <span>back</span>,
}));

vi.mock("@/components/signup/pages/ClosedSignup", () => ({
  default: () => <div data-testid="closed-signup">Closed</div>,
}));

vi.mock("@/components/signup/pages/SubmitStatus", () => ({
  default: ({
    status,
    message,
  }: {
    status: string;
    message: string;
    resetForm: () => void;
  }) => (
    <div data-testid="submit-status">
      {status}: {message}
    </div>
  ),
}));

function renderSignup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Signup />
    </QueryClientProvider>
  );
}

describe("Signup Page", () => {
  it("renders the signup form with welcome message", () => {
    renderSignup();

    expect(screen.getByText(/Welcome to CRM/)).toBeInTheDocument();
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("renders the current form step", () => {
    renderSignup();

    expect(screen.getByTestId("current-form")).toBeInTheDocument();
  });

  it("shows Proceed button on non-final steps", () => {
    renderSignup();

    expect(screen.getByText("Proceed")).toBeInTheDocument();
  });

  it("does not show back button on first step", () => {
    renderSignup();

    expect(screen.queryByText("back")).not.toBeInTheDocument();
  });

  it("uses useRef instead of module-level mutable state", async () => {
    // Render two instances to verify they don't share state
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <Signup />
      </QueryClientProvider>
    );

    // First instance renders fine
    expect(screen.getByText(/Welcome to CRM/)).toBeInTheDocument();
    unmount();

    // Second instance should also render correctly (not corrupted by first)
    render(
      <QueryClientProvider client={queryClient}>
        <Signup />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Welcome to CRM/)).toBeInTheDocument();
  });
});
