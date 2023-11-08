import axios from "axios";
import {
  readCookieConsentState,
  whenUserActOnCookieBanner,
} from "../components/gdpr/gdpr";
import { when } from "./promises.utils";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "./localStorage.utils";

const reportDemoRequestSuccess = () => {
  axios.post(
    "https://hq.tines.io/webhook/5ca96967e767b43c146cf118e3a9ae99/d41234c0e1ce4842e65e7b3eddfc466c",
    {
      body: getLocalStorageItem("lastDemoRequestFormBody"),
    }
  );
  removeLocalStorageItem("lastDemoRequestFormBody");
  whenUserActOnCookieBanner(() => {
    const consent = readCookieConsentState();
    if (!consent?.analytics) return;
    when(
      () => !!window.dataLayer,
      () => {
        window.dataLayer.push({
          event: "demo-request-success",
        });
      }
    );
  });
};

export const listenForDemoRequestSuccessEvents = () => {
  const handler = (
    e: MessageEvent<{
      action?: string;
    }>
  ) => {
    if (e.data["action"] === "booked") {
      reportDemoRequestSuccess();
    }
  };
  window.addEventListener("message", handler);
  return () => {
    window.removeEventListener("message", handler);
  };
};
