import { useRef, useCallback, useState } from "react";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
export default function useDebouncedSearch<TDataReturn>(
  func: (...args: any[]) => Promise<AxiosResponse<TDataReturn>>,
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
            setResult(response.data);
          } catch (error) {
            toast.dismiss();
            toast.error(`${args.join(" ")} not found`);
          }
        }, wait);
      }
    },
    [func, wait]
  );
  const promisifyDebounce = useCallback(
    async function (this: any, ...args: string[]) {
      clearTimeout(timer.current);
      if (args[0].length) {
        return new Promise<TDataReturn>((resolve, reject) => {
          timer.current = setTimeout(async () => {
            try {
              const res = await func.apply(this, args);
              if (res.status === 200) {
                return resolve(res.data);
              }
            } catch (err) {
              reject("not found");
              return new Error("not found");
            }
          }, wait);
        });
      }
    },
    [func, wait]
  );

  return { debounce, promisifyDebounce, result };
}
