export const isImageSrc = (src: string) =>
  src.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)/);

export const isVideoSrc = (src: string) =>
  src.toLowerCase().match(/\.(mp4|m4v|webm)/);
