import { shouldLogGDPRDebugInfo } from "../components/gdpr/gdpr";
import { isBrowser } from "../environment";
import { getCookie, setCookie } from "./cookies.utils";

const relevantParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

/**
 * Marketing attributions are grouped under 'analytics' in the cookies consent.
 * */
export const writeMarketingAttribution = () => {
  if (!isBrowser) return;
  if (shouldLogGDPRDebugInfo()) {
    // eslint-disable-next-line no-console
    console.log(`– writing marketing attributions`);
  }

  const { referrer } = document;
  const { location } = window;

  if (referrer && !/^https:\/\/[a-z]*\.tines\.com/.exec(referrer)) {
    setCookie("lastReferrer", referrer);
  }

  if (!getCookie("firstLandingPage")) {
    setCookie("firstLandingPage", location.href.split("?")[0]);
  }

  const searchParams = new URLSearchParams(location.search);
  if (relevantParams.some(param => searchParams.has(param))) {
    setCookie("lastUtmUrl", location.href);
  }
};

export const readMarketingAttribution = () => ({
  lastUtmUrl: getCookie("lastUtmUrl") ?? "",
  lastReferrer: getCookie("lastReferrer") ?? "",
  firstLandingPage: getCookie("firstLandingPage") ?? "",
});
