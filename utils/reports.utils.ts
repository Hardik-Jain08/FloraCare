import { isDevelopment } from "../environment";
import { getCookie } from "./cookies.utils";
import { readMarketingAttribution } from "./marketingAttribution.utils";

export enum KnownReportName {
  "soc2022" = "Voice of the SOC Analyst (2022)",
  "mentalHealth2022" = "Mental health (2022)",
  "playbook2022" = "No-Code Security Automation Playbook (2022)",
  "soc2023" = "Voice of the SOC (2023)",
}

export const recordReportViewOrDownloadEvent = async (
  type: "access" | "view" | "download",
  report: KnownReportName,
  form?: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    company: string;
  }
) => {
  if (isDevelopment && type === "view") return;
  await fetch(
    "https://hq.tines.io/webhook/00a65fe35eaf1d56ad1d79aff6a5a9bd/db78885cbae8892775ee4adeb0511f73",
    {
      method: "post",
      body: JSON.stringify({
        type,
        report,
        form,
        email: getCookie("email_address"),
        marketingAttributions: readMarketingAttribution(),
      }),
    }
  );
};
