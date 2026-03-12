import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/app/login/page";
import { API_URL } from "@/constants";
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
    vi.spyOn(window, "fetch").mockRestore?.();
    sessionStorage.clear();
  });

  it("renders the login form with email and password fields", () => {
    renderLogin();

    expect(screen.getByText("Login To Your Account")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Johndoe@slightytechie.io")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Login to your account" })
    ).toBeInTheDocument();
  });

  it("renders signup and forgot password links", () => {
    renderLogin();

    expect(screen.getByText("create account")).toBeInTheDocument();
    expect(screen.getByText("password?")).toBeInTheDocument();
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

  it("uses API_URL constant instead of hardcoded URL for login", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({
        token: "test-token",
        user_status: "ACCEPTED",
      }),
    } as Response);

    vi.mocked(signIn).mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: "/",
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText("Johndoe@slightytechie.io");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", {
      name: "Login to your account",
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password1!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/users/login`,
        expect.any(Object)
      );
    });
  });

  it("redirects CONTACTED users to assessment with actual email", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({
        token: "test-token",
        user_status: "CONTACTED",
      }),
    } as Response);

    vi.mocked(signIn).mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: "/",
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText("Johndoe@slightytechie.io");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password1!");
    await user.click(
      screen.getByRole("button", { name: "Login to your account" })
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        `/assesment/${encodeURIComponent("test@example.com")}`
      );
    });
  });

  it("redirects ACCEPTED users to callback URL", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({
        token: "test-token",
        user_status: "ACCEPTED",
      }),
    } as Response);

    vi.mocked(signIn).mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: "/",
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Johndoe@slightytechie.io"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: "Login to your account" })
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("stores valid token in sessionStorage", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.validSig",
        user_status: "ACCEPTED",
      }),
    } as Response);

    vi.mocked(signIn).mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: "/",
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Johndoe@slightytechie.io"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: "Login to your account" })
    );

    await waitFor(() => {
      expect(sessionStorage.getItem("authToken")).toBe("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.validSig");
    });
  });

  it("shows error when signIn fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({
        token: "test-token",
        user_status: "ACCEPTED",
      }),
    } as Response);

    vi.mocked(signIn).mockResolvedValueOnce({
      ok: false,
      error: "Invalid credentials",
      status: 401,
      url: null,
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Johndoe@slightytechie.io"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: "Login to your account" })
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("shows error when fetch throws", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Network error")
    );

    renderLogin();

    await user.type(
      screen.getByPlaceholderText("Johndoe@slightytechie.io"),
      "test@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Password1!"
    );
    await user.click(
      screen.getByRole("button", { name: "Login to your account" })
    );

    await waitFor(() => {
      expect(screen.getByText("Something went wrong...")).toBeInTheDocument();
    });
  });
});
