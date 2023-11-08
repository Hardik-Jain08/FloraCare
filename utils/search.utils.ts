import { normalizeString } from "./string.utils";

export const formatAsSearchString = (input: string) => {
  return normalizeString(input)
    .toLowerCase()
    .replace(/[^0-9a-z-_@.]/gi, "");
};
