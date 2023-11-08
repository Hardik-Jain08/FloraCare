import algoliasearch from "algoliasearch";
import { TreeBreadcrumbLevel } from "./tree.utils";
import type { Hit } from "@algolia/client-search";
import { readCookieConsentState } from "../components/gdpr/gdpr";
import { locateUserIP } from "./country.utils";
import { getLocalStorageItem, setLocalStorageItem } from "./localStorage.utils";
import { getCookie } from "./cookies.utils";
import { makeId } from "./id.utils";
import aa from "search-insights";
import { isProduction } from "../environment";
import { isOn404Page } from "./404.utils";
import { Paths } from "./pathBuilders.utils";

const Algolia = algoliasearch(
  `${process.env.GATSBY_ALGOLIA_APP_ID}`,
  `${process.env.GATSBY_ALGOLIA_SEARCH_ONLY_API_KEY}`
);

export function getQueryID() {
  // return Algolia.
  // return Algolia.helper.lastResults.queryID;
}

export const AlgoliaTinesIndex = Algolia.initIndex(
  `${process.env.GATSBY_ALGOLIA_INDEX_NAME}`
);

export const AlgoliaAnalytics = aa;

export const initAlgoliaAnalytics = async () => {
  const consent = readCookieConsentState();
  const userToken = await getOrCreateAlgoliaUserToken();
  aa("init", {
    appId: `${process.env.GATSBY_ALGOLIA_APP_ID}`,
    apiKey: `${process.env.GATSBY_ALGOLIA_SEARCH_ONLY_API_KEY}`,
    userToken,
    useCookie: !!consent?.analytics,
  });
};

export type AlgoliaTinesHitType =
  | "storyLibrary"
  | "story"
  | "docs"
  | "docsPage"
  | "api"
  | "apiPage"
  | "productUpdate"
  | "blog"
  | "article"
  | "caseStudies"
  | "caseStudy"
  | "onDemandWebinars"
  | "onDemandWebinar"
  | "university"
  | "slackCommunity"
  | "contactSupport"
  | "misc";

const hubHitTypes: AlgoliaTinesHitType[] = [
  "story",
  "docsPage",
  "apiPage",
  "productUpdate",
];
const websiteHitTypes: AlgoliaTinesHitType[] = ["caseStudy", "onDemandWebinar"];
export const isHubHit = (hit: AlgoliaTinesHit) => {
  return hubHitTypes.includes(hit.type);
};
export const isBlogHit = (hit: AlgoliaTinesHit) => {
  return hit.type === "article";
};
export const isWebsiteHit = (hit: AlgoliaTinesHit) => {
  return websiteHitTypes.includes(hit.type);
};

export type AlgoliaTinesHit = Hit<{
  objectID: string;
  type: AlgoliaTinesHitType;
  title: string;
  summary: string;
  breadcrumbs: TreeBreadcrumbLevel[];
  path: string;
  tags: string[];
  content: string;
  authors?: string[];
  headings: {
    level: number;
    text: string;
    slug: string;
  }[];
}>;

const AlgoliaAnonymousUserTokenKey = "ALGOLIA_USER_TOKEN";

const prepareToken = (str: string) =>
  str.replace(/\s+/g, "-").replace(/\./g, "_DOT_").replace(/@/g, "_AT_");

export const getOrCreateAlgoliaUserToken = async () => {
  const email = getCookie("email_address");
  if (email) return prepareToken(email);
  const existing = getLocalStorageItem(AlgoliaAnonymousUserTokenKey);
  if (existing) return `${existing}`;
  const { city, regionName, countryCode } = await locateUserIP();
  const randomId = makeId();
  const token = prepareToken(
    [randomId, city, regionName, countryCode].filter(i => i).join("__")
  );
  setLocalStorageItem(AlgoliaAnonymousUserTokenKey, token);
  return token;
};

export const reportResultClick = async (
  queryID: string | null,
  resultId: string,
  position: number
) => {
  const consent = readCookieConsentState();
  if (isProduction && !consent?.analytics) return;
  if (queryID) {
    AlgoliaAnalytics("clickedObjectIDsAfterSearch", {
      userToken: await getOrCreateAlgoliaUserToken(),
      index: `${process.env.GATSBY_ALGOLIA_INDEX_NAME}`,
      eventName: "hub_search_result_clicked",
      queryID,
      objectIDs: [resultId],
      positions: [position],
    });
  } else {
    AlgoliaAnalytics("clickedObjectIDs", {
      userToken: await getOrCreateAlgoliaUserToken(),
      index: `${process.env.GATSBY_ALGOLIA_INDEX_NAME}`,
      eventName: "hub_search_result_clicked",
      objectIDs: [resultId],
    });
  }
};

export const groupHitsByType = (hits: AlgoliaTinesHit[]) => {
  const R = {
    hub: [] as AlgoliaTinesHit[],
    docsPages: [] as AlgoliaTinesHit[],
    notDocsPages: [] as AlgoliaTinesHit[],
    apiPages: [] as AlgoliaTinesHit[],
    notApiPages: [] as AlgoliaTinesHit[],
    blog: [] as AlgoliaTinesHit[],
    notBlog: [] as AlgoliaTinesHit[],
    caseStudies: [] as AlgoliaTinesHit[],
    notCaseStudies: [] as AlgoliaTinesHit[],
    onDemandWebinars: [] as AlgoliaTinesHit[],
    notOnDemandWebinars: [] as AlgoliaTinesHit[],
  };
  hits.forEach(h => {
    if (isHubHit(h)) R.hub.push(h);
    R[h.type === "article" ? "blog" : "notBlog"].push(h);
    R[h.type === "docsPage" ? "docsPages" : "notDocsPages"].push(h);
    R[h.type === "apiPage" ? "apiPages" : "notApiPages"].push(h);
    R[h.type === "caseStudy" ? "caseStudies" : "notCaseStudies"].push(h);
    R[
      h.type === "onDemandWebinar" ? "onDemandWebinars" : "notOnDemandWebinars"
    ].push(h);
  });
  return R;
};

export const HUB_RESULTS_HEADING = "From the hub";
export const BLOG_RESULTS_HEADING = "From the Blog";

export type SearchSection = {
  title: string;
  hits: AlgoliaTinesHit[];
};

export const getCurrentAreaName = (pathname?: string | number | null) => {
  if (!pathname) return "";
  if (/^\/docs/.test(`${pathname}`)) return "Docs";
  if (/^\/api/.test(`${pathname}`)) return "API";
  if (/^\/webinars/.test(`${pathname}`)) return "Webinars";
  if (/^\/case-studies/.test(`${pathname}`)) return "Case studies";
  if (/^\/blog/.test(`${pathname}`)) return "Blog";
  return "";
};

export const sectionizeHits = (hits: AlgoliaTinesHit[], pathname: string) => {
  const sections = [] as SearchSection[];
  const grouped = groupHitsByType(
    hits.filter(hit => hit.objectID !== "contact-support")
  );
  const isInArea = {
    docs: /^\/docs/.test(`${pathname}`),
    api: /^\/api/.test(`${pathname}`),
    lessons: /^\/lessons/.test(`${pathname}`),
    webinars: /^\/webinars/.test(`${pathname}`),
    caseStudies: /^\/case-studies/.test(`${pathname}`),
    blog: /^\/blog/.test(`${pathname}`),
    "404": isOn404Page(),
  };
  const isInHub = isInArea.docs || isInArea.api || isInArea.lessons;
  const pushSection = (title: string, hits: AlgoliaTinesHit[]) =>
    sections.push({ title, hits });
  if (isInArea.docs) {
    pushSection("Documentation", grouped.docsPages);
    pushSection("Other results", grouped.notDocsPages);
  } else if (isInArea.api) {
    pushSection("API", grouped.apiPages);
    pushSection("Other results", grouped.notApiPages);
  } else if (isInArea.blog) {
    pushSection("Blog", grouped.blog);
    pushSection("Other results", grouped.notBlog);
  } else if (isInArea.webinars) {
    pushSection("On-demand webinars", grouped.onDemandWebinars);
    pushSection("Other results", grouped.notOnDemandWebinars);
  } else if (isInArea.caseStudies) {
    pushSection("Customer case studies", grouped.caseStudies);
    pushSection("Other results", grouped.notCaseStudies);
  } else {
    if (isInHub) pushSection(HUB_RESULTS_HEADING, grouped.hub);
    else pushSection("All results", hits);
  }
  if (!isInArea.blog && !isInArea["404"] && grouped.blog.length > 0) {
    pushSection(BLOG_RESULTS_HEADING, grouped.blog);
  }
  return sections;
};

export const defaultSuggestionsList: AlgoliaTinesHit[] = [
  {
    objectID: "university",
    type: "university",
    title: "University",
    summary:
      "Build your Tines knowledge by going through our dedicated learning paths",
    breadcrumbs: [],
    path: "/university",
    tags: [],
    content: "",
    headings: [],
  },
  {
    objectID: "docs",
    type: "docs",
    title: "Docs",
    summary: "Get to know the features and concepts of Tines, in detail",
    breadcrumbs: [],
    path: "/docs",
    tags: [],
    content: "",
    headings: [],
  },
  {
    objectID: "slack-community",
    type: "slackCommunity",
    title: "Slack Community",
    summary: "Engage with other Tines customers",
    breadcrumbs: [],
    path: Paths.slackCommunity(),
    tags: [],
    content: "",
    headings: [],
  },
];

export const contactSupportHit: AlgoliaTinesHit = {
  objectID: "contact-support",
  type: "contactSupport",
  title: "Contact support",
  summary: "Help center",
  breadcrumbs: [],
  path: "/contact-support",
  tags: [],
  content: "",
  headings: [],
};
