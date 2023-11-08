export const makeDisposerController = () => {
  const disposers: (() => unknown)[] = [];
  return {
    add: <T>(fn?: () => T) => fn && disposers.push(fn),
    disposer: () => disposers.forEach(d => d()),
  };
};
