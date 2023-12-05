import { useRef, useCallback, useState } from "react";
import toast from "react-hot-toast";
export default function useDebouncedSearch<TDataReturn>(
  func: (...args: any[]) => Promise<TDataReturn>,
  wait: number
) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [result, setResult] = useState<TDataReturn | null>(null);

  const debounce = useCallback(
    function (this: any, ...args: any[]) {
      clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        try {
          const response = await func.apply(this, args);
          setResult(response);
        } catch (error) {
          toast.error(`${args.join(" ")} not found`);
        }
      }, wait);
    },
    [func, wait]
  );

  return { debounce, result };
}
