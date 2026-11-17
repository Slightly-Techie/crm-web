import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SettingsPage from "@/app/(root)/settings/page";
import ProfilePage from "@/app/(root)/techie/me/page";

const { updateUserProfile } = vi.hoisted(() => ({
  updateUserProfile: vi.fn(),
}));

const user = {
  id: 1,
  first_name: "Kobi",
  last_name: "Ampem",
  username: "kobi",
  email: "kobi@example.com",
  github_profile: "",
  twitter_profile: "",
  linkedin_profile: "",
  portfolio_url: "",
  skills: [],
  tags: [],
  role: { name: "user" },
};

// Every other endpoint resolves to empty data; these pages only need the profile.
vi.mock("@/services", () => ({
  default: () =>
    new Proxy(
      {},
      {
        get: (_, name) => {
          if (name === "getUserProfile")
            return () => Promise.resolve({ data: user });
          if (name === "updateUserProfile") return updateUserProfile;
          return () => Promise.resolve({ data: [] });
        },
      }
    ),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

function renderPage(Page: () => JSX.Element) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

async function openSettings() {
  renderPage(SettingsPage);
  return screen.findByPlaceholderText("username or github.com/username");
}

async function openProfileEditor() {
  renderPage(ProfilePage);
  await userEvent.click(
    await screen.findByRole("button", { name: /edit profile/i })
  );
  return screen.findByPlaceholderText("username or github.com/username");
}

describe.each([
  ["settings page", openSettings, /save/i],
  ["my profile page", openProfileEditor, /save/i],
])("profile links on the %s", (_, open, saveButton) => {
  beforeEach(() => {
    updateUserProfile.mockReset().mockResolvedValue({ data: user });
  });

  it.each(["ransfordgenesis", "github.com/ransfordgenesis"])(
    "saves GitHub %j as a full link",
    async (typed) => {
      const github = await open();
      await userEvent.type(github, typed);
      await userEvent.click(screen.getByRole("button", { name: saveButton }));

      await waitFor(() => expect(updateUserProfile).toHaveBeenCalled());
      expect(updateUserProfile.mock.calls[0][0].github_profile).toBe(
        "https://github.com/ransfordgenesis"
      );
    }
  );

  it("rejects a javascript: link in GitHub", async () => {
    const github = await open();
    await userEvent.type(github, "javascript:alert(1)");
    await userEvent.click(screen.getByRole("button", { name: saveButton }));

    expect(
      await screen.findByText("Enter a GitHub username or a github.com link")
    ).toBeInTheDocument();
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it("rejects a portfolio with no domain, accepts one with a domain", async () => {
    await open();
    const portfolio = screen.getByPlaceholderText("yourportfolio.com");
    await userEvent.type(portfolio, "alice");
    await userEvent.click(screen.getByRole("button", { name: saveButton }));

    expect(
      await screen.findByText(
        "Enter a link to your site, like yourportfolio.com"
      )
    ).toBeInTheDocument();
    expect(updateUserProfile).not.toHaveBeenCalled();

    await userEvent.type(portfolio, ".dev");
    await userEvent.click(screen.getByRole("button", { name: saveButton }));
    await waitFor(() => expect(updateUserProfile).toHaveBeenCalled());
    expect(updateUserProfile.mock.calls[0][0].portfolio_url).toBe(
      "https://alice.dev"
    );
  });
});
