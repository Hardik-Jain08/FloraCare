export function normalizeString(input?: string | number) {
  return (`${input}` || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function capitalize(input: string) {
  if (!input) return "";
  return `${input[0].toUpperCase()}${input.slice(1)}`;
}

export function toCamelCase(input?: string | null) {
  if (!input) return "";
  return input
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
export function toPascalCase(input?: string | null) {
  if (!input) return "";
  return input
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/\s+/g, "");
}

export const makeSlug = (string: string | null | undefined) => {
  return string === null && string === undefined
    ? ""
    : normalizeString(`${string}`)
        .toLowerCase()
        .trim()
        .replace(/(\s|_)+/g, "-")
        .replace(/&/g, " and ")
        .replace(/[^\w\-]+/g, "-")
        .replace(/\-+/g, "-")
        .replace(/^\-/g, "")
        .replace(/\-$/g, "");
};

export const getPlainTextFromHTMLString = (string?: string | null) =>
  `${string ?? ""}`.replace(/<[^>]+>/g, "").trim();

export const oxfordComma = (arr: string[]) => {
  return arr.reduce(
    (str, next, i) =>
      `${str}${i ? (i === arr.length - 1 ? " and " : ", ") : ""} ${next}`,
    ""
  );
};

export const getAllPossiblePhrasesInSentence = (words: string[]) => {
  const phrases = words
    .map((word, currentIndex, arr) => {
      const subArr = arr.slice(currentIndex);
      return subArr.map((w, endIndex) =>
        subArr.slice(0, endIndex + 1).join(" ")
      );
    })
    .flat(2);
  return phrases;
};

export const getOverlappingWordsPercentage = (
  stringA: string,
  stringB: string
) => {
  const wordsA = stringA.toLowerCase().split(/-| /);
  const wordsB = stringB.toLowerCase().split(/-| /);
  const phrasesA = getAllPossiblePhrasesInSentence(wordsA);
  const phrasesB = getAllPossiblePhrasesInSentence(wordsB);
  const overlappingPhrasesCount = phrasesA.reduce((score, p) => {
    if (phrasesB.includes(p)) return score + 1;
    return score;
  }, 0);
  return overlappingPhrasesCount;
};

export const sortByMostOverlapped = (query: string, list: string[]) => {
  return list
    .map(text => ({
      text,
      score: getOverlappingWordsPercentage(query, text),
    }))
    .sort((a, b) => b.score - a.score);
};

export const formatAsFullName = (...names: (string | null | undefined)[]) => {
  return names.filter(i => i).join(" ");
};

export const words = (word: string, times: number) =>
  Array(times).fill(word).join(" ");
