import { useState, useEffect } from "react";
import useEventListener from "./useEventListener";

export default function useMouseOverCallback(
  elementRef: React.MutableRefObject<null>,
  ...args: any[]
) {
  const [isOver, setIsOver] = useState(false);

  const handleClick = (event: MouseEvent) => {
    if (!isOver) {
      args[0]();
    }
  };

  const handleMouseOver = (event: MouseEvent) => {
    setIsOver(true);
  };
  const handleMouseOut = (event: MouseEvent) => {
    setIsOver(false);
  };

  useEventListener("mouseover", handleMouseOver, elementRef);
  useEventListener("mouseout", handleMouseOut, elementRef);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return { isOver };
}
