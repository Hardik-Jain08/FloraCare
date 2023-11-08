import { css } from "styled-components";

import {
	BreakpointName,
	breakpoints,
	getValueAtBreakpointFromMap,
	mediaFrom,
} from "./breakpointsAndMediaQueries.styles";

const responsiveSizeNames = [
	"sm",
	"md",
	"lg",
	"xl",
	"xxl",
	"pageMargin",
	"sectionPadding",
	"sectionMargin",
	"cardSectionPadding",
	"widerPageMargin",
	"gridGap",
	"borderRadius",
	"layoutWithSidebarGap",
	"sidebarWidth",
	"modalScreenDefaultMinInset",
] as const;

type ArrayElementType<T> = T extends readonly (infer U)[] ? U : never;

export type ResponsiveSizeName = ArrayElementType<typeof responsiveSizeNames>;

export const isResponsiveSizeName = (
	name: unknown
): name is ResponsiveSizeName =>
	responsiveSizeNames.includes(name as ResponsiveSizeName);

/** "Responsive size" */
export const rSize = (
	sizeName: ResponsiveSizeName,
	scalar = 1,
	noCalc?: boolean
) =>
	scalar === 1
		? `var(--${sizeName})`
		: `${noCalc ? "" : "calc"}(var(--${sizeName}) * ${scalar})`;

export const responsiveSizeMaps = {
	sm: {
		// sm is the first variable to appear in the final stylesheet.
		// we list every single breakpoint, so that in the minimized production build,
		// optimized media queries will be ordered correctly based on their first appearances.
		default: 1.6,
		phone: 1.6,
		phoneMd: 1.6,
		phoneLg: 1.6,
		tablet: 1.6,
		tabletMd: 1.6,
		tabletLg: 1.6,
		desktop: 1.8,
		desktopSm: 1.8,
		desktopMd: 2,
		desktopMl: 2,
		desktopLg: 2.4, // same as grid gap size
	},
	md: {
		default: 1.8,
		tablet: 1.8,
		desktop: 2.4, // same as grid gap size
		desktopMd: 2.75,
		desktopLg: 3,
	},
	lg: {
		default: 2.4,
		tablet: 3,
		desktopMd: 3.25,
		desktopLg: 4,
	},
	xl: {
		default: 3.5,
		desktop: 4,
		desktopMd: 4.5,
		desktopLg: 5.5,
	},
	xxl: {
		default: 4.5,
		desktop: 5,
		desktopMd: 5.8,
		desktopLg: 6.4,
	},
	pageMargin: {
		default: 1.8,
		tablet: 7,
		tabletLg: 8.5,
		desktop: 8.6, // matches sectionMargin at this breakpoint
		desktopMd: 6, // makes max width 1128px, with gap 24px and col width 72px
	},
	sectionPadding: {
		default: 4,
		tablet: 4.8,
		tabletLg: 7.5,
		desktop: 8,
		desktopMd: 9,
		desktopMl: 9.6,
	},
	sectionMargin: {
		default: 9.6,
		tablet: 12,
		desktop: 12.5,
		desktopMd: 14,
		desktopLg: 15.6, // matches pageMargin for MacBook 13"
	},
	cardSectionPadding: {
		default: 2.8,
		tablet: 4,
		desktop: 5.5, // matches one column width
		desktopLg: 7.2, // matches one column width
	},
	widerPageMargin: {
		default: 0,
		tablet: 3,
		desktop: 3.5,
		desktopMd: 4,
	},
	layoutWithSidebarGap: {
		default: 1,
		tablet: 2.4 * 1,
		desktopMd: 2.4 * 2,
		desktopLg: 2.4 * 3,
	},
	sidebarWidth: {
		default: 0,
		tablet: 25,
		desktopMd: 27.9,
		desktopLg: (breakpoints.desktopLg - (68 * 12 + 24 * 11) - 24 * 3) / 10,
	},
	gridGap: {
		default: 1.6,
		tablet: 2.4,
	},
	borderRadius: {
		default: 1.2,
		tablet: 1.4,
	},
	modalScreenDefaultMinInset: {
		default: 3.8,
		tablet: 6.4,
		desktop: 7.2,
	},
};

type StringObject = Record<string, string>;

const respSizesMappedToCSSVariables = (() => {
	const result = {} as Record<string, string | StringObject>;
	Object.entries(responsiveSizeMaps).forEach(([sizeName, sizeRespSizes]) => {
		Object.entries(sizeRespSizes).forEach(([breakpoint, value]) => {
			if (breakpoint === "default") {
				result[`--${sizeName}`] = `${value}rem`;
			} else {
				const query = mediaFrom(breakpoint as BreakpointName);
				if (!result[query]) result[query] = {};
				(result[query] as StringObject)[
					`--${sizeName}`
				] = `${value}rem`;
			}
		});
	});
	return result;
})();

export const responsiveSizesCSSVariables = css`
	html {
		${respSizesMappedToCSSVariables}
	}
`;

export const getResponsiveSizeAtCurrentBreakpoint = (
	sizeName: ResponsiveSizeName
) => getValueAtBreakpointFromMap(responsiveSizeMaps[sizeName], 0);
