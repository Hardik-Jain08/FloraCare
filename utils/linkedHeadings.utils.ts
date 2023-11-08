import { cx } from "linaria";
import { RefObject, useEffect } from "react";
import {
  LinkedHeadingStyle,
  headingLinkStyle,
} from "../components/utilities/LinkedHeading";
import { scrollToHash } from "./anchorLinkScroll.utils";
import { reportErrorSilently } from "./error.utils";
import { flashNotice } from "./notice.utils";
import { makeSlug } from "./string.utils";

export const useMakeHeadingsLinkable = (
  ref?: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!ref?.current) return;
    Array.from(ref.current.querySelectorAll("h1, h2, h3"))
      .filter(
        n =>
          ["H1", "H2", "H3"].includes((n as HTMLElement).tagName) &&
          !n.classList.contains("linked-heading")
      )
      .forEach(el => {
        makeHeadingLink(el as HTMLElement);
      });
  });
};

export const makeHeadingLink = (el: HTMLElement) => {
  const h = el as HTMLHeadingElement;
  if (h.querySelector(".heading-link")) return;
  let id = makeSlug(h.innerText);
  if (/^\d/.test(id)) id = `_${id}`;
  h.innerHTML = `${h.innerHTML} <a class="${cx(
    headingLinkStyle,
    "heading-link"
  )}" href="#${id}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M13.5438 10.456C12.7247 9.63723 11.614 9.17728 10.4558 9.17728C9.29766 9.17728 8.18692 9.63723 7.36781 10.456L4.27881 13.544C3.45969 14.3631 2.99951 15.4741 2.99951 16.6325C2.99951 17.7909 3.45969 18.9019 4.27881 19.721C5.09793 20.5401 6.2089 21.0003 7.36731 21.0003C8.52572 21.0003 9.63669 20.5401 10.4558 19.721L11.9998 18.177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.4561 13.544C11.2752 14.3628 12.3859 14.8227 13.5441 14.8227C14.7022 14.8227 15.8129 14.3628 16.6321 13.544L19.7211 10.456C20.5402 9.63687 21.0004 8.52591 21.0004 7.36749C21.0004 6.20908 20.5402 5.09811 19.7211 4.27899C18.9019 3.45987 17.791 2.99969 16.6326 2.99969C15.4741 2.99969 14.3632 3.45987 13.5441 4.27899L12.0001 5.82299" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>`;
  const scrollToHeadingAndCopyLink = () => {
    scrollToHash({
      useHash: `#${id}`,
    });
    const url = new URL(window.location.href);
    url.searchParams.forEach((value, key) => url.searchParams.delete(key));
    url.hash = id;
    const urlWithHeadingAnchor = url.toString();
    try {
      navigator.clipboard.writeText(urlWithHeadingAnchor);
      flashNotice(`Copied link to <strong>"${h.innerText}"</strong>.`);
    } catch (e) {
      reportErrorSilently(e);
      flashNotice("Failed to copy link, please try copying manually.");
    }
  };
  h.querySelector(".heading-link")?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    scrollToHeadingAndCopyLink();
  });
  h.id = id;
  h.classList.add("linked-heading");
  h.classList.add(LinkedHeadingStyle);
};
