export const moveItemToNewIndex = <T>(
  arr: T[],
  item: T,
  newIndex: number,
  inPlace?: boolean
) => {
  const result = inPlace ? arr : [...arr];
  const currentIndex = arr.indexOf(item);
  result.splice(currentIndex, 1);
  result.splice(newIndex, 0, item);
  return result;
};

export const uniq = <T>(array: T[]) => Array.from(new Set(array));

export const first = <T>(array: T[]) => (array.length > 0 ? array[0] : null);
export const last = <T>(input: string | T[]) =>
  input.length > 0 ? input[input.length - 1] : null;

export const sortAlphabeticallyInPlace = (array: string[]) =>
  array.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

export const uniqBy = <T>(array: T[], prop: keyof T) => {
  const propValues = uniq(array.map(a => a[prop]));
  return propValues.map(v => array.find(a => a[prop] === v));
};

export const replaceContents = <T>(arr: T[], newContent: T[]) => {
  if (
    arr.length !== newContent.length ||
    arr.some((v, i) => v !== newContent[i])
  ) {
    arr.splice(0, arr.length, ...newContent);
  }
};

export function swapInPlaceBetweenArrays<T>(
  arrI: T[],
  arrJ: T[],
  i: number,
  j: number,
  swapIf?: (a: T, b: T) => boolean
) {
  if (arrI[i] === void 0 || arrJ[j] === void 0) return false;
  if (swapIf && !swapIf(arrI[i], arrJ[j])) return false;
  [arrI[i], arrJ[j]] = [arrJ[j], arrI[i]];
  return true;
}

export const swapInPlace = <T>(a: T[], i: number, j: number) => {
  swapInPlaceBetweenArrays(a, a, i, j);
  return a;
};

export const difference = <A, B>(arrA: A[], arrB: B[]) =>
  arrA.filter(a => !arrB.includes(a as unknown as B));

export const addOneToArrayIfNewInPlace = <T>(arr: T[], item: T) => {
  if (!arr.includes(item)) arr.push(item);
  return arr;
};

export const removeOneFromArrayIfNewInPlace = <T>(arr: T[], item: T) => {
  if (arr.includes(item)) arr.splice(arr.indexOf(item), 1);
  return arr;
};

export const addOneToArrayIfNew = <T>(arr: T[], item: T) => {
  const newArr = [...arr];
  if (!newArr.includes(item)) newArr.push(item);
  return newArr;
};

export const removeOneFromArrayIfNew = <T>(arr: T[], item: T) => {
  const newArr = [...arr];
  if (newArr.includes(item)) newArr.splice(newArr.indexOf(item), 1);
  return newArr;
};
