import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import IconFontReady from "@/components/IconFontReady";

const ICON_CSS =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";

function addIconStylesheet(loaded: boolean) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = ICON_CSS;
  // jsdom never loads stylesheets, so fake the loaded state.
  Object.defineProperty(link, "sheet", { value: loaded ? {} : null });
  document.head.appendChild(link);
  return link;
}

describe("IconFontReady", () => {
  const load = vi.fn();

  beforeEach(() => {
    load.mockReset().mockResolvedValue([]);
    Object.defineProperty(document, "fonts", {
      value: { load },
      configurable: true,
    });
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-icons");
    document.head.innerHTML = "";
  });

  it("marks icons ready once the icon font loads", async () => {
    addIconStylesheet(true);
    render(<IconFontReady />);
    await waitFor(() =>
      expect(document.documentElement.getAttribute("data-icons")).toBe("ready")
    );
    expect(load).toHaveBeenCalledWith('24px "Material Symbols Outlined"');
  });

  it("waits for the icon stylesheet before loading the font", async () => {
    const link = addIconStylesheet(false);
    render(<IconFontReady />);
    expect(load).not.toHaveBeenCalled();
    expect(document.documentElement.hasAttribute("data-icons")).toBe(false);

    link.dispatchEvent(new Event("load"));
    await waitFor(() =>
      expect(document.documentElement.getAttribute("data-icons")).toBe("ready")
    );
  });

  it("still shows icons if the stylesheet or font fails", async () => {
    const link = addIconStylesheet(false);
    render(<IconFontReady />);
    link.dispatchEvent(new Event("error"));
    expect(document.documentElement.getAttribute("data-icons")).toBe("ready");
  });
});
