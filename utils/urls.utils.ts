import { MutableRefObject, useEffect } from "react";
import { isBrowser } from "../environment";
import { uniq } from "./array.utils";

const origins = uniq([
  process.env.GATSBY_SITE_URL,
  "https://www.tines.com",
  "https://tines.com",
]);
if (isBrowser) {
  if (window.location?.origin !== process.env.GATSBY_SITE_URL)
    origins.push(window.location?.origin);
}
const originRegexps = origins.map(origin => new RegExp(`^${origin}`));

export const isRelativePath = (url: string) => {
  return !/^https?:\/\//.test(url);
};

export function addOriginIfIsRelativeUrl(url: string) {
  if (/^https?:\/\//.exec(url)) return url;
  return [
    (process.env.GATSBY_SITE_URL ?? "https://www.tines.com").replace(/\/$/, ""),
    url.replace(/^\//, ""),
  ].join("/");
}

export const isSameOrigin = (url: string) =>
  url[0] === "/" ||
  url[0] === "#" ||
  originRegexps.some(regexp => regexp.test(url));

export const useEnsureExternalLinksOpensInNewTab = (
  ref: MutableRefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    const allLinks = ref.current?.querySelectorAll("a[href]") ?? [];
    Array.from(allLinks).forEach(anchor => {
      const url = anchor.getAttribute("href");
      if (!url) return;
      if (!isSameOrigin(url)) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noreferrer noopener");
      }
    });
  });
};

export const convertStringToDataUrl = (svgString: string) =>
  `url(data:image/svg+xml,${encodeURIComponent(svgString)})`;
