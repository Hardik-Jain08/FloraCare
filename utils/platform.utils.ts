import { isBuildTime } from "../environment";

export const isMac = isBuildTime
  ? true
  : /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
