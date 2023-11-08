export const getOffsetRelativeToPage = (element: HTMLElement) => {
  let el = element as HTMLElement | null;
  let top = 0;
  let left = 0;
  do {
    top += el!.offsetTop || 0;
    left += el!.offsetLeft || 0;
    el = el!.offsetParent as HTMLElement | null;
  } while (el);

  return {
    top,
    left,
  };
};
