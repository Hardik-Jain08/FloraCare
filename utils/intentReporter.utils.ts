import { getCookie } from "./cookies.utils";

const webhookUrl =
  "https://hq.tines.io/webhook/32b0513f473c6768faba88679515ddce/6d33dd009f5a454be1df485c7e394c32";

export const reportIntent = (title: string) => {
  const email = getCookie("email_address");
  if (!email) return;

  return fetch(webhookUrl, {
    method: "post",
    body: JSON.stringify({
      email,
      title,
      description: window.location.href,
    }),
  });
};
