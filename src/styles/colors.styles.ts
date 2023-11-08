// @ts-ignore
import chroma from "chroma-js";
import { CSSProperties } from "react";

import { getStandardColorThemeNameV4, withOpacity } from "./colorsV4.styles";

export { withOpacity } from "./colorsV4.styles";

export const getStandardColorThemeName = getStandardColorThemeNameV4;

const colorMode = "lab";

const ambienceColors = {
	light: "#FCF9F5",
	dark: "#1E1C22",
	white: "#FFFFFF",
	black: "#000000",
};

const colorDefinitions = {
	purple: {
		name: "purple",
		base: "#8D75E6",
		darkest: "#231A32",
		darkShadesSaturationAdjustment: 0,
	},
	green: {
		name: "green",
		base: "#25A871",
		darkest: "#0B2222",
		darkShadesSaturationAdjustment: 0,
	},
	orange: {
		name: "orange",
		base: "#F47E3F",
		darkest: "#300808",
		darkShadesSaturationAdjustment: 1.12,
	},
	pink: {
		name: "pink",
		base: "#E269A4",
		darkest: "#311129",
		darkShadesSaturationAdjustment: 0,
	},
	lightGray: {
		name: "lightGray",
		base: "#DCD7D0",
		darkest: ambienceColors.dark,
		darkShadesSaturationAdjustment: 0,
	},
	darkGray: {
		name: "darkGray",
		base: "#32313B",
		darkest: ambienceColors.dark,
		darkShadesSaturationAdjustment: 0,
	},
	yellow: {
		name: "yellow",
		base: "#E49307",
		darkest: "#362011",
		darkShadesSaturationAdjustment: 0,
	},
	lime: {
		name: "lime",
		base: "#99B22A",
		darkest: "#232B12",
		darkShadesSaturationAdjustment: 0,
	},
	blue: {
		name: "blue",
		base: "#4E8FD0",
		darkest: "#172036",
		darkShadesSaturationAdjustment: 0,
	},
	red: {
		name: "red",
		base: "#E14F4C",
		darkest: "#321616",
		darkShadesSaturationAdjustment: 0,
	},
};

export const primaryColorMap = {
	purple: colorDefinitions.purple.base,
	green: colorDefinitions.green.base,
	orange: colorDefinitions.orange.base,
	pink: colorDefinitions.pink.base,
};

export type BaseColorName = keyof typeof colorDefinitions;
export const isBaseColorName = (input: string): input is BaseColorName =>
	input in colorDefinitions;
export const BaseColorNames = Object.keys(colorDefinitions) as BaseColorName[];

export type PrimaryColorName = keyof typeof primaryColorMap;
export const isPrimaryColorName = (input: string): input is PrimaryColorName =>
	input in primaryColorMap;
export const PrimaryColorNames = Object.keys(
	primaryColorMap
) as PrimaryColorName[];

export const makeColorScale = (
	name: string,
	hex: string,
	lightest = ambienceColors.light,
	darkest = ambienceColors.dark
) => {
	if (name.includes("Gray")) {
		return chroma
			.scale([
				lightest,
				chroma.mix(lightest, chroma(hex).brighten(0.2), 0.5, colorMode),
				hex,
				chroma.mix(darkest, chroma(hex), 0.5, colorMode),
				darkest,
			])
			.mode(colorMode)
			.colors(21);
	} else {
		return chroma
			.scale([
				lightest,
				chroma.mix(
					lightest,
					chroma(hex).brighten(0.2).saturate(1),
					0.5,
					colorMode
				),
				hex,
				chroma.mix(darkest, chroma(hex).saturate(1), 0.5, colorMode),
				darkest,
			])
			.mode(colorMode)
			.colors(21);
	}
};

export const makeColorScaleVivid = (o: {
	name: string;
	base: string;
	lightest?: string;
	darkest?: string;
	colorMode?: "lab" | "rgb";
	darkShadesSaturationAdjustment?: number;
}) => {
	const {
		name,
		base,
		lightest = ambienceColors.light,
		darkest = ambienceColors.dark,
		colorMode = "lab",
		darkShadesSaturationAdjustment = 1,
	} = o;
	if (name.includes("Gray")) {
		return chroma
			.scale([
				lightest,
				chroma.mix(
					lightest,
					chroma(base).brighten(0.2),
					0.5,
					colorMode
				),
				base,
				chroma.mix(darkest, chroma(base), 0.5, colorMode),
				darkest,
			])
			.mode(colorMode)
			.colors(21);
	} else {
		return chroma
			.scale([
				lightest,

				chroma.mix(
					lightest,
					chroma(base).brighten(0.2).saturate(1),
					0.25,
					colorMode
				),
				chroma.mix(
					lightest,
					chroma(base).brighten(0.2).saturate(1),
					0.5,
					colorMode
				),
				chroma.mix(
					lightest,
					chroma(base).brighten(0.1).saturate(0.5),
					0.75,
					colorMode
				),

				base,

				chroma.mix(
					darkest,
					chroma(base).saturate(darkShadesSaturationAdjustment),
					0.85,
					colorMode
				),
				chroma.mix(
					darkest,
					chroma(base).saturate(darkShadesSaturationAdjustment * 0.9),
					0.57,
					colorMode
				),
				chroma.mix(
					darkest,
					chroma(base).saturate(darkShadesSaturationAdjustment * 0.5),
					0.2,
					colorMode
				),

				darkest,
			])
			.mode(colorMode)
			.colors(21);
	}
};

export const standardColorScales = {
	purple: makeColorScaleVivid(colorDefinitions.purple),
	green: makeColorScaleVivid(colorDefinitions.green),
	orange: makeColorScaleVivid(colorDefinitions.orange),
	pink: makeColorScaleVivid(colorDefinitions.pink),
	lightGray: makeColorScaleVivid(colorDefinitions.lightGray),
	darkGray: makeColorScaleVivid(colorDefinitions.darkGray),
	blue: makeColorScaleVivid(colorDefinitions.blue),
	yellow: makeColorScaleVivid(colorDefinitions.yellow),
	lime: makeColorScaleVivid(colorDefinitions.lime),
	red: makeColorScaleVivid(colorDefinitions.red),
};

const colorSteps = [
	0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
	800, 850, 900, 950, 1000,
] as const;

const commonColorSteps = [
	0, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

type ArrayElementType<T> = T extends readonly (infer U)[] ? U : never;
export type ColorStep = ArrayElementType<typeof colorSteps>;
export type CommonColorStep = ArrayElementType<typeof commonColorSteps>;

export const color = (
	name: string | BaseColorName = "purple",
	step: ColorStep = 500
) => {
	if (isBaseColorName(name))
		return standardColorScales[name][(step / 100) * 2];
	return name;
};

export const getColorFromV5Scale = (scale: string[], step: ColorStep = 500) => {
	return scale[(step / 100) * 2]!;
};

export const colors = {
	white: ambienceColors.white,
	black: ambienceColors.black,
	lightest: ambienceColors.light,
	gray: chroma.mix(ambienceColors.light, ambienceColors.dark).hex(),
	darkest: ambienceColors.dark,
	purple: color("purple"),
	purple50: color("purple", 50),
	purple100: color("purple", 100),
	purple200: color("purple", 200),
	purple300: color("purple", 300),
	purple400: color("purple", 400),
	purple500: color("purple", 500),
	purple600: color("purple", 600),
	purple700: color("purple", 700),
	purple800: color("purple", 800),
	purple900: color("purple", 900),
	green: color("green"),
	green50: color("green", 50),
	green100: color("green", 100),
	green200: color("green", 200),
	green300: color("green", 300),
	green400: color("green", 400),
	green500: color("green", 500),
	green600: color("green", 600),
	green700: color("green", 700),
	green800: color("green", 800),
	green900: color("green", 900),
	orange: color("orange"),
	orange50: color("orange", 50),
	orange100: color("orange", 100),
	orange200: color("orange", 200),
	orange300: color("orange", 300),
	orange400: color("orange", 400),
	orange500: color("orange", 500),
	orange600: color("orange", 600),
	orange700: color("orange", 700),
	orange800: color("orange", 800),
	orange900: color("orange", 900),
	pink: color("pink"),
	pink50: color("pink", 50),
	pink100: color("pink", 100),
	pink200: color("pink", 200),
	pink300: color("pink", 300),
	pink400: color("pink", 400),
	pink500: color("pink", 500),
	pink600: color("pink", 600),
	pink700: color("pink", 700),
	pink800: color("pink", 800),
	pink900: color("pink", 900),
	light100: color("lightGray", 100),
	light200: color("lightGray", 200),
	light300: color("lightGray", 300),
	light400: color("lightGray", 400),
	dark500: color("darkGray", 500),
	dark600: color("darkGray", 600),
	dark700: color("darkGray", 700),
	dark800: color("darkGray", 800),
	dark900: color("darkGray", 900),
	yellow: color("yellow"),
	yellow50: color("yellow", 50),
	yellow100: color("yellow", 100),
	yellow200: color("yellow", 200),
	yellow300: color("yellow", 300),
	yellow400: color("yellow", 400),
	yellow500: color("yellow", 500),
	yellow600: color("yellow", 600),
	yellow700: color("yellow", 700),
	yellow800: color("yellow", 800),
	yellow900: color("yellow", 900),
	lime: color("lime"),
	lime50: color("lime", 50),
	lime100: color("lime", 100),
	lime200: color("lime", 200),
	lime300: color("lime", 300),
	lime400: color("lime", 400),
	lime500: color("lime", 500),
	lime600: color("lime", 600),
	lime700: color("lime", 700),
	lime800: color("lime", 800),
	lime900: color("lime", 900),
	blue: color("blue"),
	blue50: color("blue", 50),
	blue100: color("blue", 100),
	blue200: color("blue", 200),
	blue300: color("blue", 300),
	blue400: color("blue", 400),
	blue500: color("blue", 500),
	blue600: color("blue", 600),
	blue700: color("blue", 700),
	blue800: color("blue", 800),
	blue900: color("blue", 900),
	red: color("red"),
	red50: color("red", 50),
	red100: color("red", 100),
	red200: color("red", 200),
	red300: color("red", 300),
	red400: color("red", 400),
	red500: color("red", 500),
	red600: color("red", 600),
	red700: color("red", 700),
	red800: color("red", 800),
	red900: color("red", 900),
};

const makeTheme = (name: PrimaryColorName) => ({
	name: name,
	white: colors.white,
	c50: color(name, 50),
	c100: color(name, 100),
	c200: color(name, 100),
	c300: color(name, 300),
	c500: color(name, 500),
	c600: color(name, 600),
	c700: color(name, 700),
	c800: color(name, 800),
	c900: color(name, 900),
	c950: color(name, 950),
	c500Contrast: colors.white,
	accent: color(name, 500),
	accentContrast: colors.white,
	highlight: color(name, 500),
	text: color(name, 800),
	textHighlight: color(name, 500),
	textHighlightDarker: color(name, 700),
});

export const brandColorThemes = {
	purple: makeTheme("purple"),
	green: makeTheme("green"),
	orange: makeTheme("orange"),
	pink: makeTheme("pink"),
	dark: {
		name: "dark",
		white: colors.white,
		c50: color("lightGray", 50),
		c100: color("lightGray", 100),
		c200: color("lightGray", 100),
		c300: color("lightGray", 300),
		c500: color("darkGray", 500),
		c600: color("darkGray", 600),
		c700: color("darkGray", 700),
		c800: color("darkGray", 800),
		c900: color("darkGray", 900),
		c950: color("darkGray", 950),
		c500Contrast: colors.white,
		accent: colors.purple500,
		accentContrast: colors.white,
		highlight: colors.purple500,
		text: colors.dark500,
		textHighlight: colors.purple500,
		textHighlightDarker: colors.purple700,
	},
} as const;

export type BrandThemeName = keyof typeof brandColorThemes;

export const getBrandColorTheme = (themeName?: string | null) => {
	return (
		brandColorThemes[
			(themeName && themeName in brandColorThemes
				? themeName
				: getStandardColorThemeName(
						themeName
				  )) as keyof typeof brandColorThemes
		] ?? brandColorThemes.purple
	);
};

export const getBrandColorThemeVariables = (themeName?: string | null) => {
	const theme = getBrandColorTheme(themeName);
	return {
		"--AccentColor10": withOpacity(theme.c500, 0.1),
		"--AccentColor50": theme.c50,
		"--AccentColor": theme.c500,
		"--AccentColor100": theme.c100,
		"--AccentColor300": theme.c300,
		"--AccentColor600": theme.c600,
		"--AccentColor700": theme.c700,
		"--AccentColor800": theme.c800,
		"--AccentColor900": theme.c900,
	} as CSSProperties;
};

export const getBrandColorThemeVariablesAsString = (
	themeName?: string | null
) => {
	return Object.entries(getBrandColorThemeVariables(themeName))
		.map(([key, value]) => `${key}:${value};`)
		.join("");
};

export const brandColorThemeVar = (
	type: 10 | 50 | 100 | 300 | 500 | 600 | 700 | 800 | 900
) =>
	`var(--AccentColor${type === 500 ? "" : type}, ${
		type < 100 && type !== 50
			? color("purple", type as ColorStep)
			: withOpacity(color("purple"), type / 100)
	})`;
