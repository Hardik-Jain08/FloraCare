import * as Sentry from "@sentry/react";
import { isDevelopment } from "../environment";

export const reportErrorSilently = (e: unknown) => {
  // eslint-disable-next-line no-console
  console.error(e);
  Sentry.captureException(e);
};
export const printErrorInDevelopment = (e: unknown) => {
  // eslint-disable-next-line no-console
  if (isDevelopment) console.error(e);
};
