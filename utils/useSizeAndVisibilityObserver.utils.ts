import { RefObject, useState } from "react";
import { debounce } from "./debounce.utils";
import { useOnMount } from "./lifeCycle.utils";
import { when } from "./promises.utils";

export const useVisibilityObserver = (
  ref: RefObject<HTMLElement>,
  options?: {
    reversible?: boolean;
    onBecomeVisible?: () => void;
    threshold?: number | number[];
  }
) => {
  const [visible, setVisible] = useState(false);
  useOnMount(() => {
    const intersectionObserver = new IntersectionObserver(
      entries => {
        const { isIntersecting } = entries[0];
        if (options?.reversible) setVisible(entries[0].isIntersecting);
        else if (entries[0].isIntersecting) {
          setVisible(true);
          intersectionObserver.disconnect();
        }
        if (isIntersecting) options?.onBecomeVisible?.();
      },
      {
        threshold: options?.threshold,
      }
    );
    when(
      () => !!ref.current,
      () => {
        intersectionObserver.observe(ref.current!);
      }
    );
    return () => {
      intersectionObserver.disconnect();
    };
  });
  return { visible };
};

export const useSizeAndVisibilityObserver = (ref: RefObject<HTMLElement>) => {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useOnMount(() => {
    const intersectionObserver = new IntersectionObserver(entries => {
      setVisible(entries[0].isIntersecting);
    });
    const updateMeasurements = (entry: ResizeObserverEntry) => {
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
      setReady(true);
    };
    const debouncedUpdate = debounce(updateMeasurements);
    const resizeObserver = new ResizeObserver(entries => {
      if (visible || !width) updateMeasurements(entries[0]);
      else debouncedUpdate(entries[0]);
    });
    if (ref.current) {
      intersectionObserver.observe(ref.current);
      resizeObserver.observe(ref.current);
    }
    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  });
  return {
    ready,
    visible,
    width,
    height,
  };
};
