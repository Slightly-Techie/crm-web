import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/app/login/page";
import { signIn } from "next-auth/react";

// Mock useEndpoints
vi.mock("@/services", () => ({
  default: () => ({
    userLogin: vi.fn(),
  }),
}));

// Mock react-loader-spinner
vi.mock("react-loader-spinner", () => ({
  Oval: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock ThemeSwitcher
vi.mock("../../components/theme/theme", () => ({
  default: () => <div data-testid="theme-switcher" />,
}));

// Mock react-icons
vi.mock("react-icons/ai", () => ({
  AiOutlineEye: (props: Record<string, unknown>) => (
    <button data-testid="show-password" onClick={props.onClick as () => void}>
      eye
    </button>
  ),
  AiOutlineEyeInvisible: (props: Record<string, unknown>) => (
    <button data-testid="hide-password" onClick={props.onClick as () => void}>
      eye-off
    </button>
  ),
}));

const pushMock = vi.fn();
vi.mock("next/navigation", async () => {
  return {
    useRouter: () => ({
      push: pushMock,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    useSearchParams: () => ({
      get: () => null,
    }),
    usePathname: () => "/login",
  };
});

function renderLogin() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
}

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders the login form with email and password fields", () => {
    renderLogin();

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("you@company.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in to dashboard/i })
    ).toBeInTheDocument();
  });

  it("renders signup and forgot password links", () => {
    renderLogin();

    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    renderLogin();

    // Initially password should be hidden
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click to show password
    const showButton = screen.getByTestId("show-password");
    await user.click(showButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("calls signIn with the entered credentials", async () => {
    const user = userEvent.setup();
    vi.mocked(signIn).mockResolvedValueOnce({
      ok: true,
      error: null,
      status: 200,
      url: "/",
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("you@company.com"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: /sign in to dashboard/i })
    );

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({
          email: "test@example.com",
          password: "Password1!",
          redirect: false,
        })
      );
    });
  });

  it("redirects to the home route on successful sign in", async () => {
    const user = userEvent.setup();
    vi.mocked(signIn).mockResolvedValueOnce({
      ok: true,
      error: null,
      status: 200,
      url: "/",
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("you@company.com"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: /sign in to dashboard/i })
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows the error returned by signIn on failure", async () => {
    const user = userEvent.setup();
    vi.mocked(signIn).mockResolvedValueOnce({
      ok: false,
      error: "Invalid credentials",
      status: 401,
      url: null,
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("you@company.com"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: /sign in to dashboard/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("shows a generic error when signIn throws", async () => {
    const user = userEvent.setup();
    vi.mocked(signIn).mockRejectedValueOnce(new Error("Network error"));

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("you@company.com"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: /sign in to dashboard/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Something went wrong...")).toBeInTheDocument();
    });
  });

  it("shows a validation error and does not call signIn when fields are empty", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.click(
      screen.getByRole("button", { name: /sign in to dashboard/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Email must be valid")).toBeInTheDocument();
    });
    expect(signIn).not.toHaveBeenCalled();
  });
});
