import { css } from "styled-components";
import { isBuildTime } from "../../environment";
import { isNumber } from "../utils/typeChecks.utils";

export type BreakpointName = keyof typeof breakpoints;

export const breakpoints = {
	phone: 320,
	phoneSm: 400,
	phoneMd: 480,
	phoneLg: 512,
	tablet: 640,
	tabletMd: 768,
	tabletLg: 920,
	desktop: 1024, // iPad
	desktopSm: 1194, // iPad Pro 11"
	desktopMd: 1280,
	desktopMl: 1366,
	desktopLg: 1440, // max page width
	desktopXl: 1680,
	desktopHd: 1920,
} as const;

export const breakpointsArrayBottomUp = Object.entries(breakpoints);
export const breakpointsArrayTopDown = [...breakpointsArrayBottomUp].reverse();

export const mediaFrom = (breakpoint: BreakpointName | number) =>
	`@media (min-width: ${
		isNumber(breakpoint) ? breakpoint : breakpoints[breakpoint]
	}px)`;
export const mediaUpto = (breakpoint: BreakpointName | number) =>
	`@media (max-width: ${
		isNumber(breakpoint) ? breakpoint : breakpoints[breakpoint] - 1
	}px)`;
export const mediaFromTo = (
	from: BreakpointName | number,
	to: BreakpointName | number
) =>
	`@media (min-width: ${
		isNumber(from) ? from : breakpoints[from]
	}px) and (max-width: ${(isNumber(to) ? to : breakpoints[to]) - 1}px)`;

export const onlyPhones = mediaUpto("tablet");
export const onlyTablets = mediaFromTo("tablet", "desktop");

export const uptoPhoneSm = mediaUpto("phoneSm");
export const fromPhoneSm = mediaFrom("phoneSm");
export const uptoPhoneMd = mediaUpto("phoneMd");
export const fromPhoneMd = mediaFrom("phoneMd");
export const uptoPhoneLg = mediaUpto("phoneLg");
export const fromPhoneLg = mediaFrom("phoneLg");

export const uptoTablet = mediaUpto("tablet");
export const fromTablet = mediaFrom("tablet");
export const fromTabletMd = mediaFrom("tabletMd");
export const fromTabletLg = mediaFrom("tabletLg");

export const uptoTabletMd = mediaUpto("tabletMd");
export const uptoTabletLg = mediaUpto("tabletLg");

export const fromDesktop = mediaFrom("desktop");
export const fromDesktopSm = mediaFrom("desktopSm");
export const fromDesktopMd = mediaFrom("desktopMd");
export const fromDesktopMl = mediaFrom("desktopMl");
export const fromDesktopLg = mediaFrom("desktopLg");
export const fromDesktopXl = mediaFrom("desktopXl");
export const fromDesktopHd = mediaFrom("desktopHd");

export const uptoDesktop = mediaUpto("desktop");
export const uptoDesktopSm = mediaUpto("desktopSm");
export const uptoDesktopMd = mediaUpto("desktopMd");
export const uptoDesktopMl = mediaUpto("desktopMl");
export const uptoDesktopLg = mediaUpto("desktopLg");
export const uptoDesktopXl = mediaUpto("desktopXl");
export const uptoDesktopHd = mediaUpto("desktopHd");

export const in4ColGrid = uptoPhoneLg;
export const in8ColGrid = mediaFromTo("phoneLg", "tabletLg");
export const in8Or12ColGrid = fromPhoneLg;
export const in12ColGrid = fromTabletLg;
export const from12ColGrid = fromTabletLg;
export const whenOverMaxWidth = fromDesktopLg;

export const inLightMode = `@media (prefers-color-scheme: light)`;
export const inDarkMode = `@media (prefers-color-scheme: dark)`;

export const hideOnMobile = css`
	${onlyPhones} {
		display: none !important;
	}
`;

export type ResponsiveValueMap<T> = Partial<Record<BreakpointName, T>>;

export const getValueAtBreakpointFromMap = <T>(
	map: ResponsiveValueMap<T>,
	defaultValue: T,
	vw?: number
) => {
	const entries = Object.entries(map);
	const defaultValueToReturn = defaultValue ?? entries[0]?.[1];
	if (isBuildTime) return defaultValueToReturn;
	const w = vw ?? window.innerWidth;
	entries.reverse();
	// eslint-disable-next-line no-restricted-syntax
	for (const [breakpoint, value] of entries) {
		if (breakpoints[breakpoint as BreakpointName] < w) return value;
	}
	return defaultValueToReturn;
};
