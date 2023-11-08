import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { getValueAtBreakpointFromMap } from "../styles/breakpointsAndMediaQueries.styles";
import { clampBetween } from "./math.utils";
import { getOffsetRelativeToPage } from "./measurements.utils";
import { resolveAfter, when } from "./promises.utils";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
gsap.registerPlugin(CustomEase);

export const clearHash = () => {
  window.history.replaceState(
    null,
    document.title,
    document.location.pathname + document.location.search
  );
};

export const scrollToHash = async (options?: {
  useHash?: string;
  onScrollComplete?: (target?: HTMLElement | null) => void;
  easeIn?: boolean;
  offsetY?: number;
  duration?: number;
  doNotPushState?: boolean;
}) => {
  const { useHash, onScrollComplete, easeIn, doNotPushState } = options ?? {};
  const hash = useHash ?? window.location.hash;
  if (!hash) return;
  if (hash === "#") {
    gsap.to(window, {
      duration: options?.duration ?? 1,
      ease: "expo.out",
      scrollTo: {
        y: 0,
      },
      onComplete: clearHash,
    });
    return;
  }
  await resolveAfter();
  const getElement = () => document.getElementById(hash.replace("#", ""));
  let element = getElement();
  const onComplete = (
    strategy: "pushState" | "replaceState" = "replaceState"
  ) => {
    if (!doNotPushState) {
      // place back the hash in the url after we are done
      window.history[strategy](
        null,
        document.title,
        `${document.location.pathname}${window.location.search}${hash}`
      );
    }
    document.documentElement.classList.remove("programmatic-scrolling");
    onScrollComplete?.(element);
  };
  if (!element) {
    await resolveAfter(100);
    element = getElement();
    if (!element) {
      onComplete("pushState");
      return;
    }
  }
  const elementComputedStyle = getComputedStyle(element);
  let definedOffsetY =
    elementComputedStyle.getPropertyValue("scroll-margin-top");
  if (definedOffsetY === "auto") definedOffsetY = "0";
  const offsetY =
    options?.offsetY ??
    (definedOffsetY
      ? parseInt(definedOffsetY) * -1
      : getValueAtBreakpointFromMap(
          {
            tablet: -78,
            tabletLg: -84,
          },
          -64
        ));
  const distance = getOffsetRelativeToPage(element).top - window.scrollY;
  const duration =
    options?.duration ??
    clampBetween(distance / 1000, 0.6, 1) + (easeIn ? 0.25 : 0);
  document.documentElement.classList.add("programmatic-scrolling");
  gsap.to(window, {
    duration,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ease: CustomEase.create(
      "custom",
      easeIn
        ? "M0,0,C0.298,-0.002,0.222,0.446,0.32,0.718,0.408,0.962,0.557,1,1,1"
        : "M0,0,C0.176,0,0.094,0.38,0.218,0.782,0.272,0.958,0.374,1,1,1"
    ),
    scrollTo: {
      y: hash,
      offsetY: -offsetY,
    },
    onComplete,
  });
};

const isScrollingProgrammatically = () =>
  document.documentElement.classList.contains("programmatic-scrolling");

export const waitForProgrammaticScrollingEnd = (fn: () => void) => {
  if (!isScrollingProgrammatically) fn();
  else when(() => !isScrollingProgrammatically(), fn);
};

export const listenToBeforeHashChange = (
  handler: (e: CustomEvent<{ hash: string }>) => void
) => {
  window.addEventListener(
    "beforehashchange" as keyof WindowEventMap,
    handler as (e: Event) => void
  );
  return () => {
    window.removeEventListener(
      "beforehashchange" as keyof WindowEventMap,
      handler as (e: Event) => void
    );
  };
};
