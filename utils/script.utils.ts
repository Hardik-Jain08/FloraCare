const loadedScripts = new Map<
  string,
  {
    src: string;
    script: HTMLScriptElement;
    loaded: boolean;
    errored: boolean;
    onLoadCallbacks: (() => void)[];
    onErrorCallbacks: ((e: unknown) => void)[];
  }
>();

export const loadScript = (options: {
  src: string;
  onLoad?: () => void | Promise<void>;
  onError?: (e: unknown) => void;
}) =>
  new Promise<void>((resolve, reject) => {
    const existing = loadedScripts.get(options.src);
    if (existing) {
      if (existing.loaded) options.onLoad?.();
      else if (existing.errored) options.onError?.(undefined);
      else {
        options.onLoad && existing.onLoadCallbacks.push(options.onLoad);
        options.onError && existing.onErrorCallbacks.push(options.onError);
      }
    } else {
      const script = document.createElement("script");
      const record = {
        src: options.src,
        script,
        loaded: false,
        errored: false,
        onLoadCallbacks: options.onLoad ? [options.onLoad] : [],
        onErrorCallbacks: options.onError ? [options.onError] : [],
      };
      loadedScripts.set(options.src, record);
      script.onload = () => {
        record.loaded = true;
        record.onLoadCallbacks.forEach(fn => fn());
        resolve();
      };
      script.onerror = e => {
        record.errored = true;
        record.onErrorCallbacks.forEach(fn => fn(e));
        reject();
      };
      script.src = options.src;
      document.body.append(script);
    }
  });
