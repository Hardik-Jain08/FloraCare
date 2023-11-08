/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import Prism from "prismjs";
import { RefObject, useEffect } from "react";
import { useSiteContext } from "../context/site.context";
import { runAfter, when } from "./promises.utils";
declare global {
  interface Window {
    Prism: typeof Prism;
  }
}

export const loadPrism = () =>
  new Promise<void>(resolve => {
    const script = document.createElement("script");
    script.setAttribute("id", "prism-js");
    script.src = "/vendors/prism.js";
    script.type = "text/javascript";
    script.onload = () => resolve();
    document.head.append(script);
    const stylesheet = document.createElement("link");
    stylesheet.type = "text/css";
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/vendors/prism.css";
    document.head.append(stylesheet);
  });

export const convertDatoCMSPreToPrismInput = (pre: HTMLPreElement) => {
  const lang = pre.getAttribute("data-language");
  const codeNodes = Array.from(pre.querySelectorAll<HTMLSpanElement>("code"));
  pre.removeAttribute("data-language");
  pre.classList.forEach(c => pre.classList.remove(c));
  pre.classList.add(`line-numbers`);
  if (lang) pre.classList.add(`lang-${lang}`);
  pre.classList.add("initiated");
  if (codeNodes.length > 0) {
    codeNodes.forEach(code => {
      code?.setAttribute("data-manual", "");
      code?.setAttribute("data-prismjs-copy", "copy");
    });
  } else {
    pre?.setAttribute("data-manual", "");
    pre?.setAttribute("data-prismjs-copy", "copy");
  }
};
export const applyPrismCodeHighlight = (ref: RefObject<HTMLElement | null>) => {
  const applyHighlight = () => {
    if (!ref.current) return;
    Array.from(
      ref.current.querySelectorAll<HTMLPreElement>(
        "pre:not(.initiated):not(.prismjs-ignore)"
      )
    ).forEach(pre => {
      convertDatoCMSPreToPrismInput(pre);
      let codeNodes = Array.from(pre.querySelectorAll("code"));
      if (codeNodes.length === 0) codeNodes = [pre];
      codeNodes.forEach(node => {
        when(
          () => !!window.Prism,
          () => {
            window.Prism?.highlightElement(node);
          }
        );
      });
    });
  };
  const existingScriptTag = document.getElementById("prism-js");
  if (existingScriptTag) {
    try {
      applyHighlight();
    } catch (e) {
      console.error(e);
    }
    return;
  }
  loadPrism().then(applyHighlight);
};
export const useApplyPrismCodeHighlight = (
  ref: RefObject<HTMLElement | null>
) => {
  const siteContext = useSiteContext();
  useEffect(() => {
    if (siteContext.isClient) {
      runAfter(() => {
        applyPrismCodeHighlight(ref);
      });
    }
  }, [siteContext.isClient, ref]);
};
