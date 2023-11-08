import { CollectionType } from "./library.utils";

export const Paths = {
  home: () => `/`,
  login: () => "https://login.tines.com",
  signup: () =>
    `https://hq.tines.io/webhook/b5bee396bc6288ff41f5a178ba9380b7/15e40f8226982fdde178c0c248f2aef6`,
  whatsNew: () => `/whats-new`,
  product: () => `/product`,
  buildApps: () => `/product/build-apps`,
  cases: () => "/product/cases",
  pricing: () => `/pricing`,
  partnership: () => `/partnerships`,
  formulas: () => `/product/formulas`,
  forMssps: () => `/for-mssps`,
  ydwwt: () => `/you-did-what-with-tines`,
  blog: () => `/blog`,
  podcast: () => `/podcast`,
  events: () => `/events`,
  webinars: () => `/webinars`,
  caseStudies: () => `/case-studies`,
  caseStudiesAll: () => `/case-studies/all`,
  caseStudy: (slug?: null | string) => `/case-studies/${slug ?? ""}`,
  solutionPage: (slug?: null | string) => `/solutions/${slug ?? ""}`,
  reportSoc2023: () => `/reports/voice-of-the-soc-2023`,
  reportSoc2023Access: () => `/access/report-voice-of-the-soc-2023`,
  reportSoc2023Pdf: () =>
    `/reports/${encodeURIComponent(
      "Tines Report - Voice of the SOC 2023.pdf"
    )}`,
  library: {
    home: () => "/library",
    stories: (o?: { query?: string }) =>
      [`/library/stories`, o?.query ? `s=${encodeURIComponent(o.query)}` : ""]
        .filter(i => i)
        .join("?"),
    story: (id: string, slug?: string | null) =>
      `/library/stories/${id}/${slug}`,
    tools: () => `/library/tools`,
    tool: (toolSlug: string) => `/library/tools/${toolSlug}`,
    collection: (type?: string | null, slug?: string | null) =>
      [
        "/library",
        type === CollectionType.team
          ? "teams"
          : type === CollectionType.useCase
          ? "use-cases"
          : "",
        slug,
      ]
        .filter(i => i)
        .join("/"),
  },
  university: () => "/university",
  bookADemo: () => "/book-a-demo",
  docs: () => "/docs/quickstart",
  api: () => "/api/welcome",
  getCertified: () => "/get-certified",
  about: () => "/about",
  newsroom: () => "/newsroom",
  careers: () => "/careers",
  contact: () => "/contact",
  tinesExplained: () => "https://explained.tines.com/en/",
  bootcamp: () => "/bootcamp",
  termsCE: () => "/terms",
  termsPaidPlans: () => "/sales-terms",
  privacy: () => "/privacy",
  security: () => "/security",
  gdprRequest: () => "/gdpr-request",
  supportReferenceGuide: () => `/support-reference-guide`,
  subProcessors: () => "/sub-processors",
  dataProcessingAgreement: () => "/dpa",
  dataProtectionNotice: () =>
    "/data-protection-notice-for-recruitment-and-job-applications",
  linkedIn: () => "https://www.linkedin.com/company/tines-io/",
  twitter: () => "https://twitter.com/tines_io",
  youTube: () => "https://www.youtube.com/@TinesHQ",
  slackCommunity: () =>
    "https://hq.tines.io/forms/6f8b122ccba3cb7e8e0d3531d1b70eb2",
};
