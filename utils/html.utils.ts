export const decodeHTML = (encodedHtml: string) => {
  const regex = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    lt: "<",
    gt: ">",
  } as Record<string, string>;
  return encodedHtml
    .replace(regex, (match, entity) => {
      return `${translate[entity as string]}` ?? `${entity}`;
    })
    .replace(/&#(\d+);/gi, (match, numStr: string) => {
      const num = parseInt(numStr, 10);
      return (
        String.fromCharCode(num)
          // remove script and style tags
          .replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "")
          .replace(/<style[^>]*>([\S\s]*?)<\/style>/gim, "")
      );
    });
};

export const getFirstVisibleElement = (
  elements: (HTMLElement | { element: HTMLElement; offsetTop: number })[],
  offset = 0
): HTMLElement | undefined => {
  const entry = elements.find((heading, i) => {
    const next = elements[i + 1];
    if (!next) return true;
    return next.offsetTop > window.scrollY + offset;
  });
  if (!entry) return entry;
  if ("element" in entry) return entry.element;
  return entry;
};

export const simpleHtmlToText = (text: string) =>
  text
    .replace(/<style[^>]*>.*<\/style>/gm, "")
    .replace(/<script[^>]*>.*<\/script>/gm, "")
    .replace(/<[^>]+>/gm, "")
    .replace(/([\r\n]+ +)+/gm, "");
