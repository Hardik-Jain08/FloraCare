/* eslint-disable no-console */
import { shouldLogGDPRDebugInfo } from "../components/gdpr/gdpr";

export const reportPageView = (options: {
  page_title: string;
  page_location: string;
  page_path: string;
}) => {
  if (typeof window.dataLayer !== "undefined") {
    window.dataLayer.push({ event: "gatsby-route-change" });
    if (shouldLogGDPRDebugInfo()) {
      console.log("– Reporting gatsby-route-change");
    }
  }
  if (typeof window.gtag !== "undefined") {
    const pathIsExcluded =
      typeof window.excludeGtagPaths !== `undefined` &&
      window.excludeGtagPaths.some(rx => rx.test(location.pathname));
    if (pathIsExcluded) return null;
    window.gtag("event", "page_view", options);
    if (shouldLogGDPRDebugInfo()) {
      console.log("– Reporting gtag page_view", options.page_path);
    }
  }
};
