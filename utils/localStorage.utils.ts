// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLocalStorageItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // LocalStorage sometimes being unavailable is expected
    // just log the error so we know it happened when looking at the console
    console.error("Can not setItem. LocalStorage is not available"); // eslint-disable-line no-console
  }
}

export function getLocalStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : null;
  } catch (e) {
    return null;
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // nothing to do
  }
}
