import { isBrowser } from "../environment";
import { useOnMount } from "./lifeCycle.utils";

export const useResizeObserver = (
  handler: ResizeObserverCallback,
  ref: React.RefObject<HTMLElement | SVGElement>
) => {
  const observer = isBrowser
    ? ResizeObserver
      ? new ResizeObserver(handler)
      : null
    : null;
  useOnMount(() => {
    if (!observer) return;
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  });
};
