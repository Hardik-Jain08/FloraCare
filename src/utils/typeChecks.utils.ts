// TODO: improve so that the type checker can narrow input type to its valid object sub-types
export const isObject = <T extends Record<string, unknown>>(
  input: unknown
): input is T => input instanceof Object;

export const isNonArrayObject = <T extends Record<string, unknown>>(
  input: unknown
): input is T => input instanceof Object && !(input instanceof Array);

export const isArray = <T extends Array<unknown> = Array<unknown>>(
  input: unknown
): input is T => input instanceof Array;

export const isString = (input: unknown): input is string =>
  typeof input === "string";

export const isNumber = (input: unknown): input is number =>
  typeof input === "number";

export const isStringOrNumber = (input: unknown): input is string | number =>
  typeof input === "string" || typeof input === "number";

export const isNotNil = <T>(input: T) => input !== null && input !== undefined;
