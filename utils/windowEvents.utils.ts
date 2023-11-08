import { useState } from "react";
import { isBrowser } from "../environment";
import { useOnWindowResize } from "./window.utils";

export const useViewportSize = (
  onResize?: (vw: number, vh: number) => void
) => {
  const [vw, setVw] = useState(isBrowser ? window.innerWidth : 1024);
  const [vh, setVh] = useState(isBrowser ? window.innerHeight : 768);
  const measureWindowSize = () => {
    setVw(window.innerWidth);
    setVh(window.innerHeight);
    onResize?.(vw, vh);
  };
  useOnWindowResize(measureWindowSize);
  return [vw, vh];
};
