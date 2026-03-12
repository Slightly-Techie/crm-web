import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useMouseOverCallback from "@/hooks/useMouseOverCallback";

// Mock useEventListener to capture handlers
const eventHandlers: Record<string, ((event: Event) => void)[]> = {};
vi.mock("@/hooks/useEventListener", () => ({
  default: (
    eventName: string,
    handler: (event: Event) => void,
    _ref: React.MutableRefObject<null>
  ) => {
    if (!eventHandlers[eventName]) {
      eventHandlers[eventName] = [];
    }
    eventHandlers[eventName].push(handler);
  },
}));

describe("useMouseOverCallback", () => {
  beforeEach(() => {
    Object.keys(eventHandlers).forEach((key) => delete eventHandlers[key]);
  });

  it("should return isOver as false initially", () => {
    const ref = { current: null };
    const callback = vi.fn();
    const { result } = renderHook(() => useMouseOverCallback(ref, callback));

    expect(result.current.isOver).toBe(false);
  });

  it("should call callback when clicking outside the element", () => {
    const ref = { current: null };
    const callback = vi.fn();
    renderHook(() => useMouseOverCallback(ref, callback));

    // Simulate a click on the document (not hovering over element)
    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking while hovering over the element", () => {
    const ref = { current: null };
    const callback = vi.fn();
    renderHook(() => useMouseOverCallback(ref, callback));

    // Simulate mouseover on the element
    const mouseoverHandler = eventHandlers["mouseover"]?.[0];
    if (mouseoverHandler) {
      act(() => {
        mouseoverHandler(new MouseEvent("mouseover"));
      });
    }

    // Now click - should NOT trigger callback since we're over the element
    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should clean up document click listener on unmount", () => {
    const ref = { current: null };
    const callback = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useMouseOverCallback(ref, callback));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });

  it("should not add duplicate event listeners on re-render", () => {
    const ref = { current: null };
    const callback = vi.fn();
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");

    const { rerender } = renderHook(() => useMouseOverCallback(ref, callback));

    const initialCallCount = addEventListenerSpy.mock.calls.filter(
      ([event]) => event === "click"
    ).length;

    // Re-render with same props
    rerender();

    const afterRerenderCount = addEventListenerSpy.mock.calls.filter(
      ([event]) => event === "click"
    ).length;

    // Should not add additional listeners on re-render with same callback
    expect(afterRerenderCount).toBe(initialCallCount);
    addEventListenerSpy.mockRestore();
  });
});
