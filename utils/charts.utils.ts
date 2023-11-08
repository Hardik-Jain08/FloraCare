import { isBrowser } from "../environment";
import { loadScript } from "./script.utils";

let chartLibraryReady = false;
const handlers = [] as (() => void)[];
if (isBrowser) {
  loadScript({
    src: "https://www.gstatic.com/charts/loader.js",
    onLoad: async () => {
      await google.charts.load("current", { packages: ["corechart"] });
      chartLibraryReady = true;
      handlers.forEach(h => h());
    },
  });
}
export const onChartLibraryReady = (fn: () => void) => {
  if (chartLibraryReady) fn();
  else handlers.push(fn);
};
