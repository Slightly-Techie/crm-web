import { useState, useEffect, useCallback } from "react";
import useEventListener from "./useEventListener";

export default function useMouseOverCallback(
  elementRef: React.MutableRefObject<null>,
  callback: () => void
) {
  const [isOver, setIsOver] = useState(false);

  const handleClick = useCallback(() => {
    if (!isOver) {
      callback();
    }
  }, [isOver, callback]);

  const handleMouseOver = useCallback(() => {
    setIsOver(true);
  }, []);

  const handleMouseOut = useCallback(() => {
    setIsOver(false);
  }, []);

  useEventListener("mouseover", handleMouseOver, elementRef);
  useEventListener("mouseout", handleMouseOut, elementRef);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return { isOver };
}
