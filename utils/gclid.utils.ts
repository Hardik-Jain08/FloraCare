import { readCookieConsentState } from "../components/gdpr/gdpr";
import { isBuildTime } from "../environment";
import { getCookie, setCookie } from "./cookies.utils";
import { getLocalStorageItem } from "./localStorage.utils";
import { getUrlQueryParams } from "./urlQueryParams.utils";

function getExpiryRecord(value: string) {
  const expiryPeriod = 90 * 24 * 60 * 60 * 1000; // 90 day expiry in milliseconds
  const expiryDate = new Date().getTime() + expiryPeriod;
  return { value, expiryDate };
}

type GCLIDRecord = ReturnType<typeof getExpiryRecord>;

export function readGCLID() {
  if (isBuildTime) return "";

  const { marketing: consentedToMarketingCookies } =
    readCookieConsentState() ?? {};

  const { gclid: gclidParam = "", gclsrc: gclsrcParam = "" } =
    getUrlQueryParams();

  let gclidRecord: GCLIDRecord | null = null;
  const isGclsrcValid = !gclsrcParam || gclsrcParam.indexOf("aw") !== -1;

  if (gclidParam && isGclsrcValid) {
    gclidRecord = getExpiryRecord(gclidParam);
    if (consentedToMarketingCookies) {
      setCookie("GCLID", JSON.stringify(gclidRecord), { days: 90 });
    }
  }

  const cookieGCLID = getCookie("GCLID");
  const gclid =
    gclidRecord || cookieGCLID
      ? getExpiryRecord(cookieGCLID || "")
      : (JSON.parse(
          getLocalStorageItem("gclid") as string
        ) as GCLIDRecord | null);

  const isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;

  return isGclidValid ? gclid.value : "";
}
