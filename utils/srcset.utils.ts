export const makeSrcSet2x = (src: string, src2x: string) => {
  return `${src} 1x, ${src2x} 2x`;
};
export const makeSrcSet = (definition: Record<string, string>) => {
  return Object.entries(definition)
    .map(e => `${e[1]} ${e[0]}w`)
    .join(",");
};

export const makeSizes = (definition: Record<string, string | number>) => {
  return Object.entries(definition)
    .map((e, i, arr) =>
      i === arr.length - 1 ? `${e[1]}px` : `(max-width: ${e[0]}px) ${e[1]}px`
    )
    .join(",");
};
