import img1 from "../../static/images/tines-404-illustration-goggles.png";
import img2 from "../../static/images/tines-404-illustration-ufo.png";
import { isBrowser } from "../environment";

import { flashNotice } from "./notice.utils";

export const flash404Notice = (
  message = "The page you are looking for does not exist."
) => {
  flashNotice(
    `<img src="${
      Math.round(performance.now()) % 2 === 0 ? img1 : img2
    }" /><p>${message}</p>`,
    8000
  );
};

export const isOn404Page = () =>
  isBrowser
    ? document.documentElement.getAttribute("data-404") === "true"
    : false;
