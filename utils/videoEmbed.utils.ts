export type VideoMeta = {
  host: "youtube" | "loom" | "unknown";
  id?: string;
};

export const getVideoMetaFromUrl = (url?: string | null): VideoMeta => {
  const defaultValue = {
    host: "unknown",
  } as const;
  if (!url) return defaultValue;
  if (/youtube.com/.test(url)) {
    return {
      host: "youtube",
      id: /https?:\/\/www.youtube.com\/watch\?v=([^&]+)/.exec(url)?.[1],
    };
  }
  if (/youtu.be/.test(url)) {
    return {
      host: "youtube",
      id: /https?:\/\/youtu.be\/([^&]+)/.exec(url)?.[1],
    };
  }
  if (/loom.com/.test(url)) {
    return {
      host: "loom",
      id: /https?:\/\/www.loom.com\/share\/([^&]+)/.exec(url)?.[1],
    };
  }
  return defaultValue;
};
