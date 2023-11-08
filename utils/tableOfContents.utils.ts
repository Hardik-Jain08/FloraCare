import { MutableRefObject } from "react";

export const generateTableOfContents = (
  ref: MutableRefObject<HTMLDivElement | null>,
  includeLevels?: ("h2" | "h3" | "h4" | "h5" | "h6")[]
) => {
  const article = ref.current ?? null;
  const title = article?.querySelector("h1");
  const headings = Array.from(
    article?.querySelectorAll<HTMLHeadingElement>(
      includeLevels?.join(",") ?? "h2, h3"
    ) ?? []
  );
  const toc = headings
    .map(h => ({
      text: h.getAttribute("data-plaintext") || h.innerText,
      anchor: `#${h.getAttribute("id") ?? ""}`,
      level: parseInt(h.tagName[1]),
    }))
    .filter(h => h.anchor !== "#");
  if (title)
    toc.unshift({
      text: title.innerText,
      anchor: "#",
      level: 1,
    });
  return toc;
};

export type TableOfContents = ReturnType<typeof generateTableOfContents>;
