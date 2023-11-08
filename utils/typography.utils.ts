const widowPreventerRegex = /\s(?=[^\s]*$)/g;

export const preventWidows = (input: string, threshold = 11) => {
  let words = input.trim().split(" ");
  if (words.length < 3) return input;
  if (words[words.length - 1].length >= threshold) return input;
  const value = input.replace(widowPreventerRegex, "\u00A0");
  words = value.split(" ");
  if (words.length > 2) return value;
  if (words.length <= 3) {
    const first = words[0];
    const last = words[words.length - 1];
    if (!first || !last) return value;
    if (first.length < last.length) return input;
  }
  return value;
};
