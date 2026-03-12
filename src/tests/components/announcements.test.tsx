import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Announcements from "@/components/Feed/new/announcements";
import { AnnouncementDataResponse } from "@/types";

// Mock data
const mockAnnouncements: AnnouncementDataResponse[] = [
  { id: 1, title: "Announcement 1", content: "Content 1", created_at: "2026-01-01T00:00:00Z" },
  { id: 2, title: "Announcement 2", content: "Content 2", created_at: "2026-01-02T00:00:00Z" },
  { id: 3, title: "Announcement 3", content: "Content 3", created_at: "2026-01-03T00:00:00Z" },
  { id: 4, title: "Announcement 4", content: "Content 4", created_at: "2026-01-04T00:00:00Z" },
  { id: 5, title: "Announcement 5", content: "Content 5", created_at: "2026-01-05T00:00:00Z" },
  { id: 6, title: "Announcement 6", content: "Content 6", created_at: "2026-01-06T00:00:00Z" },
];

let mockReturnValue: {
  isFetching: boolean;
  isFetchingError: boolean;
  Announcements: AnnouncementDataResponse[];
};

vi.mock("@/services/AnnouncementServices", () => ({
  useFetchAnnouncements: () => mockReturnValue,
}));

vi.mock("@/components/loadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock("@/utils", () => ({
  getTimeElapsedOrDate: (date: string) => "2 days ago",
}));

describe("Announcements Component", () => {
  beforeEach(() => {
    mockReturnValue = {
      isFetching: false,
      isFetchingError: false,
      Announcements: mockAnnouncements,
    };
  });

  it("renders announcements heading with count", () => {
    render(<Announcements />);

    expect(screen.getByText(/Announcements/)).toBeInTheDocument();
    expect(screen.getByText(`+ ${mockAnnouncements.length}`)).toBeInTheDocument();
  });

  it("shows only initial 3 announcements", () => {
    render(<Announcements />);

    expect(screen.getByText("Announcement 1")).toBeInTheDocument();
    expect(screen.getByText("Announcement 2")).toBeInTheDocument();
    expect(screen.getByText("Announcement 3")).toBeInTheDocument();
    expect(screen.queryByText("Announcement 4")).not.toBeInTheDocument();
  });

  it("shows 'Show More' button when there are more than 3 announcements", () => {
    render(<Announcements />);

    expect(screen.getByText("Show More")).toBeInTheDocument();
  });

  it("does not show toggle button when 3 or fewer announcements", () => {
    mockReturnValue.Announcements = mockAnnouncements.slice(0, 3);
    render(<Announcements />);

    expect(screen.queryByText("Show More")).not.toBeInTheDocument();
    expect(screen.queryByText("Show Less")).not.toBeInTheDocument();
  });

  it("shows more announcements when Show More is clicked", async () => {
    const user = userEvent.setup();
    render(<Announcements />);

    await user.click(screen.getByText("Show More"));

    // Now should show 6 items (all of them)
    expect(screen.getByText("Announcement 4")).toBeInTheDocument();
    expect(screen.getByText("Announcement 5")).toBeInTheDocument();
    expect(screen.getByText("Announcement 6")).toBeInTheDocument();
  });

  it("changes button text to 'Show Less' when all items are shown", async () => {
    const user = userEvent.setup();
    render(<Announcements />);

    await user.click(screen.getByText("Show More"));

    expect(screen.getByText("Show Less")).toBeInTheDocument();
  });

  it("collapses back to initial limit when Show Less is clicked", async () => {
    const user = userEvent.setup();
    render(<Announcements />);

    // Expand
    await user.click(screen.getByText("Show More"));
    expect(screen.getByText("Announcement 6")).toBeInTheDocument();

    // Collapse - should reset to initial 3, not just subtract 3
    await user.click(screen.getByText("Show Less"));

    expect(screen.getByText("Announcement 1")).toBeInTheDocument();
    expect(screen.getByText("Announcement 2")).toBeInTheDocument();
    expect(screen.getByText("Announcement 3")).toBeInTheDocument();
    expect(screen.queryByText("Announcement 4")).not.toBeInTheDocument();
  });

  it("shows loading spinner when fetching", () => {
    mockReturnValue.isFetching = true;
    mockReturnValue.Announcements = undefined as any;
    render(<Announcements />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows error message when fetch fails", () => {
    mockReturnValue.isFetchingError = true;
    mockReturnValue.Announcements = undefined as any;
    render(<Announcements />);

    expect(
      screen.getByText("There is an error fetching posts")
    ).toBeInTheDocument();
  });

  it("shows 'No Announcements' when list is empty", () => {
    mockReturnValue.Announcements = [];
    render(<Announcements />);

    expect(screen.getByText("No Announcements")).toBeInTheDocument();
  });
});
