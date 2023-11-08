import axios from "axios";
import { reportErrorSilently } from "./error.utils";

export const emailIsLegitimate = (email: string) =>
  new Promise<boolean>(resolve => {
    if (!email || !email.includes("@")) {
      resolve(false);
      return;
    }
    try {
      axios
        .get<boolean>(
          `/api/utils/check-email-legitimacy?email=${encodeURIComponent(
            email
          )}`,
          {
            timeout: 12000,
          }
        )
        .then(r => resolve(r.data))
        .catch(e => {
          reportErrorSilently(e);
          resolve(true);
        });
    } catch (e) {
      reportErrorSilently(e);
      resolve(true);
    }
  });
