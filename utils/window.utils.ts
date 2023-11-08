import { useState } from "react";
import { useOnMount } from "./lifeCycle.utils";

export const UI = {
  vw: 1024,
  vh: 768,
};

export const useOnWindowResize = (handler: () => void) => {
  useOnMount(() => {
    handler();
    window.addEventListener("resize", handler);
    window.addEventListener("load", handler, { once: true });
    return () => {
      window.removeEventListener("resize", handler);
    };
  });
};

export const useViewportSize = (defaultWidth = 1024, defaultHeight = 768) => {
  const [vw, setVw] = useState(defaultWidth);
  const [vh, setVh] = useState(defaultHeight);
  useOnMount(() => {
    const handler = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    handler();
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  });
  return { vw, vh };
};
