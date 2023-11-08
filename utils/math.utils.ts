import { NumericRange } from "../types/helper.types";
import { swapInPlace } from "./array.utils";

export const clampBetween = (value: number, floor: number, ceil: number) => {
  return Math.min(Math.max(floor, value), ceil);
};

export const snapToNearestMultiplesOfValue = (
  value: number,
  snapTo: number,
  useMethod: "round" | "floor" | "ceil" = "round"
) => {
  return Math[useMethod](value / snapTo) * snapTo;
};

export const sumOfArray = (numbers: number[]) =>
  numbers.reduce((a, b) => a + b, 0);

export function padZero(value: number | null = 0, length = 2) {
  let valueString = value?.toString() || "0";
  while (valueString.length < length) {
    valueString = "0" + valueString;
  }
  return valueString;
}

export function percent(value: number, total: number) {
  return ((value / total) * 100).toFixed(1).replace(/\.0+$/, "") + "%";
}
export const pc = percent;

export const formatRange = (r: NumericRange | null) =>
  !r ? r : r[0] > r[1] ? swapInPlace(r, 0, 1) : r;

export const getRangesIntersection = (
  a: NumericRange | null,
  b: NumericRange | null
) => {
  if (!a || !b) return [];
  const A = formatRange(a)!;
  const B = formatRange(b)!;
  const min0 = Math.max(A[0], B[0]);
  const max1 = Math.min(A[1], B[1]);
  if (min0 < max1) return [min0, max1];
  return null;
};

export const rangesIntersect = (a: NumericRange, b: NumericRange) =>
  Math.max(a[0], b[0]) < Math.min(a[1], b[1]);

export const convertToRange = (value: number, range: [number, number]) => {
  const [floor, ceil] = range;
  return floor + (ceil - floor) * value;
};

export const atLeast = (a: number, b: number) => {
  return Math.max(a, b);
};
