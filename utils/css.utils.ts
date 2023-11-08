import { isNotNil, isNumber } from "./typeChecks.utils";

export const valueWithOptionalUnit = (
  value?: string | number | null,
  fallback?: string | number
): string =>
  isNumber(value)
    ? `${value}px`
    : value ?? valueWithOptionalUnit(fallback, "") ?? "";

export const px = <T extends number | null>(value?: T) =>
  isNotNil(value) ? `${value}px` : (value as T & null);
