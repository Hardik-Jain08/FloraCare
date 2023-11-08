import { transparentize } from "polished";

export type BrandColorNameV4 = keyof typeof colorPaletteV4;
export type CommonColorNameV4 = keyof typeof colorsV4;

export const isBrandColorNameV4 = (input: string): input is BrandColorNameV4 =>
	Object.keys(colorPaletteV4).includes(input);

export type ColorVariantNameV4 =
	| 50
	| 100
	| 300
	| 500
	| 550
	| 600
	| 650
	| 700
	| 800
	| 900
	| 1000;

export const isCssColorKeyword = (input: string) =>
	["transparent", "inherit", "initial"].includes(input);

export const colorV4 = (
	value?: BrandColorNameV4 | CommonColorNameV4 | string | null,
	variant?: ColorVariantNameV4
) => {
	if (!value) return "";
	if (value[0] === "#") return value;
	if (isCssColorKeyword(value)) return value;
	const v = value === "warmBlack" ? "grey" : value;
	if (!(v in colorPaletteV4)) {
		if (variant) {
			throw Error(
				`You should not include a variant name for non-brand color name input. A good example is "color("canvas", 500)". You have provided "color(${[
					value,
					variant,
				]
					.filter((i) => i)
					.join(",")})".`
			);
		}
		return colorsV4[v as keyof typeof colorsV4] ?? v ?? "";
	}
	const map = colorPaletteV4[v as BrandColorNameV4];
	const variantName = variant ? `${variant}` : "500";
	if (variantName in map) return map[variantName as keyof typeof map];
	throw Error(
		`Unknown color chosen: ${value}, ${variant}${
			variant ? "" : ` (presumed to be ${variantName})`
		}`
	);
};

export const withOpacity = (
	colorName: BrandColorNameV4 | CommonColorNameV4 | string,
	opacity = 1
) => {
	if (isCssColorKeyword(colorName)) return colorName;
	if (colorName in colorsV4) {
		const hex = colorV4(colorName, 500);
		return opacity === 1 ? hex : transparentize(1 - opacity, hex);
	}
	return transparentize(1 - opacity, colorName);
};

export const colorPaletteV4 = {
	black: {
		"500": "#000000",
	},
	white: {
		"500": "#FFFFFF",
		"700": "#FFFFFF",
	},
	canvas: {
		/** Pure white */
		"50": "#FFFFFF",
		/** Standard page background color */
		"300": "#FFFDFB",
		"400": "#FDFAF7",
		"500": "#FCF9F5",
		/** Standard page header background color */
		"550": "#F8F4F0",
		"600": "#F6F2ED",
		"650": "#F3EFE9",
		"700": "#F0EBE5",
		"900": "#EAE3DA",
	},
	grey: {
		"50": "#EEEEEE",
		"100": "#E0E0E0",
		"300": "#D8D8D8",
		"500": "#AEADAB",
		// "600": "#979598",
		"700": "#32313B",
		"800": "#2A2930",
		"900": "#222126",
		"1000": "#161518",
	},
	purple: {
		"50": "#ECEAFF",
		"100": "#D4CFFC",
		"300": "#B0A6F9",
		/** Primary purple */
		"500": "#8578E6",
		"700": "#665DAC",
	},
	green: {
		"50": "#EDF9F4",
		"100": "#C0E9D8",
		"300": "#81D8B4",
		"500": "#45BE8B",
		"700": "#2C9469",
	},
	orange: {
		"50": "#FFEDE5",
		"100": "#FFD8C8",
		"300": "#FBB598",
		"500": "#F69267",
		"700": "#D4744B",
	},
	pink: {
		"50": "#FFE9F3",
		"100": "#FFCCE2",
		"300": "#FDB2D2",
		"500": "#F48EBA",
		"700": "#CE6492",
	},
	lime: {
		"50": "#EFF5DC",
		"100": "#DFEDB2",
		"500": "#C2DD6C",
		"700": "#95B332",
	},
	blue: {
		"50": "#E1EBFA",
		"100": "#BBD5FA",
		"300": "#8FBCFD",
		"500": "#6DA2F0",
		"700": "#406AAA",
	},
	yellow: {
		"50": "#FFF0D9",
		"100": "#FFE1B2",
		"500": "#FFBD59",
		"700": "#A67B3A",
	},
};

export const colorsV4 = {
	black: colorPaletteV4.black["500"],
	white: colorPaletteV4.canvas["50"],
	canvas300: colorPaletteV4.canvas["300"],
	canvas400: colorPaletteV4.canvas["400"],
	canvas: colorPaletteV4.canvas["500"],
	canvas550: colorPaletteV4.canvas["550"],
	canvas600: colorPaletteV4.canvas["600"],
	canvas650: colorPaletteV4.canvas["650"],
	canvas700: colorPaletteV4.canvas["700"],
	canvas900: colorPaletteV4.canvas["900"],
	grey: colorPaletteV4.grey["500"],
	grey300: colorPaletteV4.grey["300"],
	warmBlack: colorPaletteV4.grey["700"],
	warmBlack800: colorPaletteV4.grey["800"],
	warmBlack900: colorPaletteV4.grey["900"],
	warmBlack1000: colorPaletteV4.grey["1000"],
	purple50: colorPaletteV4.purple["50"],
	purple100: colorPaletteV4.purple["100"],
	purple300: colorPaletteV4.purple["300"],
	purple700: colorPaletteV4.purple["700"],
	purple: colorPaletteV4.purple["500"],
	green50: colorPaletteV4.green["50"],
	green100: colorPaletteV4.green["100"],
	green300: colorPaletteV4.green["300"],
	green700: colorPaletteV4.green["700"],
	green: colorPaletteV4.green["500"],
	orange50: colorPaletteV4.orange["50"],
	orange100: colorPaletteV4.orange["100"],
	orange300: colorPaletteV4.orange["300"],
	orange700: colorPaletteV4.orange["700"],
	orange: colorPaletteV4.orange["500"],
	pink50: colorPaletteV4.pink["50"],
	pink100: colorPaletteV4.pink["100"],
	pink300: colorPaletteV4.pink["300"],
	pink700: colorPaletteV4.pink["700"],
	pink: colorPaletteV4.pink["500"],
	lime: colorPaletteV4.lime["500"],
	lime700: colorPaletteV4.lime["700"],
	blue: colorPaletteV4.blue["500"],
	blue700: colorPaletteV4.blue["700"],
	yellow: colorPaletteV4.yellow["500"],
	yellow50: colorPaletteV4.yellow["50"],
	yellow100: colorPaletteV4.yellow["100"],
	yellow700: colorPaletteV4.yellow["700"],
};

const ColorThemeNameToStandardColorNameMapV4 = {
	Purple: "purple",
	Green: "green",
	Orange: "orange",
	Pink: "pink",
	Blue: "blue",
	"Warm Black": "warmBlack",
	Canvas: "canvas",
} as const;

export type ColorThemeDisplayNameV4 =
	keyof typeof ColorThemeNameToStandardColorNameMapV4;

export const getStandardColorThemeNameV4 = (
	themeName?: string | null
): ColorThemeNameV4 => {
	return (
		ColorThemeNameToStandardColorNameMapV4[
			themeName as ColorThemeDisplayNameV4
		] ??
		(Object.values(ColorThemeNameToStandardColorNameMapV4).includes(
			themeName as ColorThemeNameV4
		)
			? (themeName as ColorThemeNameV4)
			: ColorThemeNameToStandardColorNameMapV4.Purple)
	);
};

export const brandColorThemesV4 = {
	purple: {
		name: "purple",
		white: colorPaletteV4.white[500],
		faded: colorPaletteV4.purple[50],
		lightest: colorPaletteV4.purple[100],
		lighter: colorPaletteV4.purple[100],
		light: colorPaletteV4.purple[300],
		primary: colorPaletteV4.purple[500],
		highlight: colorPaletteV4.purple[500],
		dark: colorPaletteV4.purple[700],
		primaryContrast: colorPaletteV4.white[500],
		text: colorPaletteV4.grey[700],
		textHighlight: colorPaletteV4.purple[500],
		textHighlightDarker: colorPaletteV4.purple[700],
	},
	green: {
		name: "green",
		white: colorPaletteV4.white[500],
		faded: colorPaletteV4.green[50],
		lighter: colorPaletteV4.green[100],
		light: colorPaletteV4.green[300],
		primary: colorPaletteV4.green[500],
		highlight: colorPaletteV4.green[500],
		dark: colorPaletteV4.green[700],
		primaryContrast: colorPaletteV4.white[500],
		text: colorPaletteV4.grey[700],
		textHighlight: colorPaletteV4.green[500],
		textHighlightDarker: colorPaletteV4.green[700],
	},
	orange: {
		name: "orange",
		white: colorPaletteV4.white[500],
		faded: colorPaletteV4.orange[50],
		lighter: colorPaletteV4.orange[100],
		light: colorPaletteV4.orange[300],
		primary: colorPaletteV4.orange[500],
		highlight: colorPaletteV4.orange[500],
		dark: colorPaletteV4.orange[700],
		primaryContrast: colorPaletteV4.white[500],
		text: colorPaletteV4.grey[700],
		textHighlight: colorPaletteV4.orange[500],
		textHighlightDarker: colorPaletteV4.orange[700],
	},
	pink: {
		name: "pink",
		white: colorPaletteV4.white[500],
		faded: colorPaletteV4.pink[50],
		lighter: colorPaletteV4.pink[100],
		light: colorPaletteV4.pink[300],
		primary: colorPaletteV4.pink[500],
		highlight: colorPaletteV4.pink[500],
		dark: colorPaletteV4.pink[700],
		primaryContrast: colorPaletteV4.white[500],
		text: colorPaletteV4.grey[700],
		textHighlight: colorPaletteV4.pink[500],
		textHighlightDarker: colorPaletteV4.pink[700],
	},
	blue: {
		name: "blue",
		white: colorPaletteV4.white[500],
		faded: colorPaletteV4.blue[50],
		lighter: colorPaletteV4.blue[100],
		light: colorPaletteV4.blue[300],
		primary: colorPaletteV4.blue[500],
		highlight: colorPaletteV4.blue[500],
		dark: colorPaletteV4.blue[700],
		primaryContrast: colorPaletteV4.white[500],
		text: colorPaletteV4.grey[700],
		textHighlight: colorPaletteV4.blue[500],
		textHighlightDarker: colorPaletteV4.blue[700],
	},
	warmBlack: {
		name: "warmBlack",
		white: colorPaletteV4.white[500],
		faded: colorPaletteV4.canvas[300],
		lighter: colorPaletteV4.canvas[500],
		light: colorPaletteV4.grey[300],
		primary: colorPaletteV4.grey[700],
		highlight: colorPaletteV4.purple[500],
		dark: colorPaletteV4.black[500],
		primaryContrast: colorPaletteV4.white[500],
		text: colorPaletteV4.grey[700],
		textHighlight: colorPaletteV4.purple[500],
		textHighlightDarker: colorPaletteV4.purple[700],
	},
	canvas: {
		name: "canvas",
		white: colorPaletteV4.white[500],
		faded: colorPaletteV4.canvas[300],
		lighter: colorPaletteV4.canvas[300],
		light: colorPaletteV4.canvas[500],
		primary: colorPaletteV4.canvas[550],
		highlight: colorPaletteV4.purple[500],
		dark: colorPaletteV4.canvas[700],
		primaryContrast: colorPaletteV4.grey[700],
		text: colorPaletteV4.grey[700],
		textHighlight: colorPaletteV4.purple[500],
		textHighlightDarker: colorPaletteV4.purple[700],
	},
} as const;

export const getBrandColorThemeC4 = (themeName?: string | null) => {
	return brandColorThemesV4[getStandardColorThemeNameV4(themeName)];
};

export type ColorThemeV4 =
	(typeof brandColorThemesV4)[keyof typeof brandColorThemesV4];
export type ColorThemeNameV4 = keyof typeof brandColorThemesV4 | "blue";

export const isNeutralColorThemeV4 = (theme: Record<string, unknown>) =>
	theme.name === "canvas" || theme.name === "black";

export const defaultChartColorSeriesV4 = [
	colorsV4.purple,
	colorsV4.green,
	colorsV4.orange,
	colorsV4.pink,
	colorsV4.yellow,
	colorsV4.blue,
	colorsV4.lime,
	colorsV4.purple300,
	colorsV4.green300,
	colorsV4.orange300,
	colorsV4.pink300,
	colorsV4.grey,
];
