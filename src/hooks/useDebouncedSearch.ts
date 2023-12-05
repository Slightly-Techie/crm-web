import { useRef, useCallback, useState } from "react";
import toast from "react-hot-toast";
export default function useDebouncedSearch<TDataReturn>(
  func: (...args: any[]) => Promise<TDataReturn>,
  wait: number
) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [result, setResult] = useState<TDataReturn | null>(null);

  const debounce = useCallback(
    function (this: any, ...args: string[]) {
      clearTimeout(timer.current);
      if (args[0].length) {
        timer.current = setTimeout(async () => {
          try {
            toast.loading("Searching...");
            const response = await func.apply(this, args);
            toast.dismiss();
            setResult(response);
          } catch (error) {
            toast.dismiss();
            toast.error(`${args.join(" ")} not found`);
          }
        }, wait);
      }
    },
    [func, wait]
  );

  return { debounce, result };
}
