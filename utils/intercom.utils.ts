import { navigate } from "gatsby";
import { printErrorInDevelopment } from "./error.utils";
import { isDevelopment } from "../environment";

declare global {
  function Intercom(action: string, options?: unknown): unknown;
}

export const openIntercomMessenger = () => {
  try {
    if (!Intercom) {
      navigate("/contact-support");
      return;
    }
    Intercom("show");
  } catch (e) {
    printErrorInDevelopment(e);
    navigate("/contact-support");
  }
};

export const showIntercomButton = () => {
  try {
    if (!Intercom) return;
    Intercom("update", { hide_default_launcher: false });
  } catch (e) {
    printErrorInDevelopment(e);
  }
};

export const hideIntercomButton = () => {
  try {
    if (!Intercom) return;
    Intercom("update", { hide_default_launcher: true });
  } catch (e) {
    printErrorInDevelopment(e);
  }
};

export const mimicIntercomBanner = () => {
  if (isDevelopment) {
    document.body.style.setProperty("transition", "margin 250ms ease 0s");
    document.body.style.setProperty("margin-top", "50px");
    document.body.style.setProperty("max-height", "calc(100% - 50px)");
  }
};
