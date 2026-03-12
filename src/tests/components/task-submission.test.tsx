import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaskSubmissionForm from "@/app/(root)/(assesment)/assesment/[email]/components/task-submission";

// Mock useAxiosAuth
const mockPost = vi.fn();
vi.mock("@/hooks/useAxiosAuth", () => ({
  default: () => ({
    post: mockPost,
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  }),
}));

// Mock react-hot-toast
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock("react-hot-toast", () => ({
  default: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

function renderTaskSubmission() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskSubmissionForm />
    </QueryClientProvider>
  );
}

describe("TaskSubmissionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error/log noise from the component's try/catch blocks
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders the form with github link, demo url, and description fields", () => {
    renderTaskSubmission();

    expect(
      screen.getByPlaceholderText("Your GitHub submission link")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Live demo URL (optional)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Additional info (optional)")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit assessment" })
    ).toBeInTheDocument();
  });

  it("requires github_link field", async () => {
    const user = userEvent.setup();
    renderTaskSubmission();

    // Submit without filling github_link
    await user.click(
      screen.getByRole("button", { name: "Submit assessment" })
    );

    // Should show validation error
    expect(
      screen.getByText(/Field must not be empty/)
    ).toBeInTheDocument();
  });

  it("submits successfully with valid data", async () => {
    const user = userEvent.setup();
    mockPost.mockResolvedValueOnce({
      data: { id: 1, github_link: "https://github.com/test/repo" },
    });

    renderTaskSubmission();

    await user.type(
      screen.getByPlaceholderText("Your GitHub submission link"),
      "https://github.com/test/repo"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit assessment" })
    );

    // Wait for mutation to complete
    await vi.waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/applicant/submission/",
        expect.objectContaining({
          github_link: "https://github.com/test/repo",
        })
      );
    });
  });

  it("shows specific error message from API on failure", async () => {
    const user = userEvent.setup();
    const apiError = {
      response: {
        data: { message: "Submission deadline has passed" },
      },
    };
    mockPost.mockRejectedValueOnce(apiError);

    renderTaskSubmission();

    await user.type(
      screen.getByPlaceholderText("Your GitHub submission link"),
      "https://github.com/test/repo"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit assessment" })
    );

    await vi.waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Submission deadline has passed"
      );
    });
  });

  it("shows generic error when API error has no message", async () => {
    const user = userEvent.setup();
    mockPost.mockRejectedValueOnce(new Error("Network error"));

    renderTaskSubmission();

    await user.type(
      screen.getByPlaceholderText("Your GitHub submission link"),
      "https://github.com/test/repo"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit assessment" })
    );

    await vi.waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Failed to submit assessment. Please try again."
      );
    });
  });

  it("re-enables submit button after error", async () => {
    const user = userEvent.setup();
    mockPost.mockRejectedValueOnce(new Error("Server error"));

    renderTaskSubmission();

    await user.type(
      screen.getByPlaceholderText("Your GitHub submission link"),
      "https://github.com/test/repo"
    );
    const submitButton = screen.getByRole("button", {
      name: "Submit assessment",
    });
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
