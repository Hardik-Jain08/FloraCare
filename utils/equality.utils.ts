export const isEqualByJson = <T>(a: T, b: T) =>
  JSON.stringify(a) === JSON.stringify(b);
