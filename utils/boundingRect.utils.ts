export function getElementBoundingBoxFromPage(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    bottom: rect.top + window.scrollY + rect.height,
    left: rect.left + window.scrollX,
    right: rect.left + window.scrollX + rect.width,
    width: rect.width,
    height: rect.height,
  };
}
