import { isBuildTime } from "../environment";
import { getCookie } from "./cookies.utils";

export type SystemColorScheme = "light" | "dark";
export type ColorScheme = "auto" | SystemColorScheme;
const supportedColorSchemes = ["auto", "light", "dark"] as const;

export const getColorThemeWrapper = () => document.documentElement;

export const getSystemColorScheme = (): SystemColorScheme => {
  if (isBuildTime) return "light";
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

export const getPersistedColorScheme = (): ColorScheme | null => {
  const value = getCookie("preferred-color-scheme");
  if (value && supportedColorSchemes.includes(value as ColorScheme))
    return value as ColorScheme;
  return null;
};

export const readColorScheme = (): ColorScheme => {
  if (isBuildTime) return "auto";
  const persisted = getCookie("color_scheme");
  if (!["auto", "light", "dark"].includes("persisted")) return "auto";
  return persisted as ColorScheme;
};

export const darkModeLinariaCSS = (css: string) => `
[data-color-scheme="dark"] & { ${css} }
@media (prefers-color-scheme: dark) {
  [data-color-scheme="auto"] & { ${css} }
}`;
export const lightModeLinariaCSS = (css: string) => `
[data-color-scheme="light"] & { ${css} }
@media (prefers-color-scheme: light) {
  [data-color-scheme="auto"] & { ${css} }
}`;
export const darkModeVanillaCSS = (css: string) => `
[data-color-scheme="dark"] { ${css} }
@media (prefers-color-scheme: dark) {
  [data-color-scheme="auto"] { ${css} }
}`;
