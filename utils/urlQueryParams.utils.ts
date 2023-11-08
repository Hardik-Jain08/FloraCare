import { isBuildTime } from "../environment";

export const getUrlQueryParams = <T extends Record<string, string>>() => {
  const result = {} as Partial<T>;
  if (isBuildTime) return result;
  const url = new URL(window.location.href);
  url.searchParams.forEach((value, key) => {
    Reflect.set(result, key, value);
  });
  return result;
};

export const getUrlQueryParam = (name: string) => {
  return getUrlQueryParams()[name];
};

export const removeUrlQueryParam = (
  key: string,
  use?: "pushState" | "replaceState"
) => {
  setUrlQueryParams(
    {
      [key]: null,
    },
    use
  );
};

export const setUrlQueryParam = (
  key: string,
  value: string | null,
  use?: "pushState" | "replaceState"
) => {
  setUrlQueryParams({ [key]: value }, use);
};

export const setUrlQueryParams = (
  params: Record<string, string | null | undefined>,
  use?: "pushState" | "replaceState"
) => {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (!value) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  });
  window.history[use ?? "replaceState"](null, document.title, url.toString());
};
