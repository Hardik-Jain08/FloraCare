import { css } from "linaria";
import { NumericRange } from "../types/helper.types";
import { rangesIntersect } from "./math.utils";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
gsap.registerPlugin(CustomEase);

export const hideScrollbarsCSS = css`
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

export function getScrollParent(
  node?: HTMLElement | SVGElement
): HTMLElement | null {
  if (!node) return null;
  const isElement = node instanceof HTMLElement;

  if (isElement) {
    const overflowY = window.getComputedStyle(node).overflowY;
    const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

    if (isScrollable && node.scrollHeight >= node.clientHeight) {
      return node;
    }
  }

  return node.parentNode
    ? getScrollParent(node.parentNode as HTMLElement) ?? document.body
    : document.body;
}

export const elementIsVisibleInScrollParent = (options: {
  el: HTMLElement | null;
  scrollParent?: HTMLElement | null;
  visibleHeightRangeOffsetTop?: number;
  visibleHeightRangeOffsetBottom?: number;
}) => {
  const { el } = options;
  if (!el) return false;
  const scrollParent = options.scrollParent ?? getScrollParent(el);
  if (!scrollParent) return false;
  const visibleHeightRange = [
    scrollParent.scrollTop + (options.visibleHeightRangeOffsetTop ?? 0),
    scrollParent.scrollTop +
      scrollParent.clientHeight +
      (options.visibleHeightRangeOffsetBottom ?? 0),
  ] as NumericRange;
  const childHeightRange = [
    el.offsetTop,
    el.offsetTop + el.clientHeight,
  ] as NumericRange;
  return rangesIntersect(visibleHeightRange, childHeightRange);
};

export const scrollIntoViewIfNotVisible = (
  el: HTMLElement,
  scrollParent?: HTMLElement | null
) => {
  if (elementIsVisibleInScrollParent({ el, scrollParent })) return;
  gsap.to(scrollParent ?? getScrollParent(el), {
    duration: 0.5,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ease: CustomEase.create(
      "custom",
      "M0,0,C0.176,0,0.094,0.38,0.218,0.782,0.272,0.958,0.374,1,1,1"
    ),
    scrollTo: {
      y: el.offsetTop - 100,
    },
  });
};

export const scrollToTop = (duration?: number) => {
  gsap.to(window, {
    duration: duration ?? Math.min(window.scrollY, 225) / 1000,
    ease: "expo.out",
    scrollTo: {
      y: 0,
    },
  });
};
