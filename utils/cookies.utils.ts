import { isBuildTime } from "../environment";
import Cookies from "js-cookie";

export function getAllCookies() {
  return Cookies.get();
}

export function getCookie(name: string) {
  if (isBuildTime) return null;
  const nameEQ = `${name}=`;
  const cookieStringArray = document.cookie.split(";");
  for (const cookieString of cookieStringArray) {
    const trimmed = cookieString.trimStart();
    if (trimmed.indexOf(nameEQ) === 0)
      return decodeURIComponent(
        trimmed.substring(nameEQ.length, cookieString.length)
      );
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options?: {
    days?: number;
    path?: string;
    domain?: string;
  }
) {
  if (isBuildTime) return;
  const {
    days,
    path = "/",
    domain = window.location.hostname.includes("tines.com") && "tines.com",
  } = options ?? {};

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = date.toUTCString();
  }

  const cookieEntries = [
    [name, encodeURIComponent(value) || ""],
    ["expires", expires],
    ["path", path],
    ["domain", domain],
  ];

  const cookie = cookieEntries
    .filter(c => !!c[1])
    .map(e => e.join("="))
    .join("; ");

  document.cookie = cookie;

  return cookie;
}

export const deleteCookie = (name: string) => {
  Cookies.remove(name);
};
