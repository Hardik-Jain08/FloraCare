/* eslint-disable no-console */

export const resolveAfter = (duration?: number) =>
  new Promise(resolve => setTimeout(resolve, duration));

export const runAfter = async <T>(fn: () => T, wait?: number) => {
  await resolveAfter(wait);
  fn();
};

export const when = async (
  condition: () => boolean,
  onConditionFulfilled?: () => void,
  options?: {
    recheckInterval?: number;
    timeout?: number;
    onTimeout?: () => void;
  }
) => {
  let alive = true;
  const recheckInterval = options?.recheckInterval ?? 100;
  const timeout = options?.timeout;
  const abort = () => {
    if (timeout && alive) {
      console.warn(`\`when\` timed out after ${timeout / 1000} seconds`);
      alive = false;
      options?.onTimeout?.();
    } else {
      return;
    }
  };
  window.addEventListener("beforeunload", abort);
  if (timeout) runAfter(abort, timeout);
  while (!condition() && alive) {
    await resolveAfter(recheckInterval);
  }
  if (alive) {
    alive = false;
    window.removeEventListener("beforeunload", abort);
    onConditionFulfilled?.();
  }
  return abort;
};
