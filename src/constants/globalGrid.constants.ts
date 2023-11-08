import { css } from "styled-components";
import {
	in12ColGrid,
	in8ColGrid,
	whenOverMaxWidth,
} from "../styles/breakpointsAndMediaQueries.styles";
import { rSize } from "../styles/responsiveSizes.styles";

export const GRID_GAP = 24;
export const GRID_GAP_PX = `${GRID_GAP}px`;
export const GRID_COL_WIDTH_MAX = GRID_GAP * 3;
export const GRID_COL_WIDTH_PX_MAX = `${GRID_COL_WIDTH_MAX}px`;
export const gridGaps = (v = 1) => GRID_GAP * v;
export const gridGapsPx = (v = 1) => `${GRID_GAP * v}px`;
export const gridGapPx = gridGapsPx;
export const getGridMaxWidth = (columns = 12) =>
	GRID_GAP * (columns - 1) + GRID_COL_WIDTH_MAX * columns;
export const GRID_MAX_WIDTH = getGridMaxWidth();
export const GRID_MAX_WIDTH_PX = `${getGridMaxWidth()}px`;

export type GridColNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridExtraGapNumber = 1 | 2;
export type GridContentWidthShorthand =
	| `${GridColNumber}col${"s" | ""}`
	| `${GridColNumber}col${"s" | ""}${GridExtraGapNumber}gap${"s" | ""}`
	| `${GridExtraGapNumber}gap${"s" | ""}`;

const GridContentWidthShortHandRegex = /^(?:(\d+)cols?)?(?:(\d+)gaps?)?$/;
export const isGridContentWidthShorthand = (
	input: unknown
): input is GridContentWidthShorthand => {
	return (
		typeof input === "string" &&
		!!GridContentWidthShortHandRegex.exec(input)
	);
};

// give a col number that's bigger than one,
// the result will always include the gaps in-between the columns.
export const getColAndGapsFromShorthand = (input: string) => {
	const result = GridContentWidthShortHandRegex.exec(input);
	if (!result) return null;
	const cols = parseInt(result[1]) || 0;
	let gaps = parseInt(result[2]) || 0;
	if (cols > 1) gaps += cols - 1;
	return [cols, gaps] as [cols: number, extraGaps: number];
};

export const gridGlobalStyle = css`
	:global() {
		:root {
			// this empty rule set is here so that the following styles are correctly syntax-highlighted
		}
		:root {
			--ScrollbarWidth: 0px;
			--grid-max-width: ${getGridMaxWidth()}px;
			--rendered-grid-width: calc(
				100vw - var(--ScrollbarWidth) - ${rSize("pageMargin")} -
					${rSize("pageMargin")}
			);
			${whenOverMaxWidth} {
				--rendered-grid-width: var(--grid-max-width);
			}
			--grid-gap: ${rSize("gridGap")};
			--grid-column-count: 4;
			${in8ColGrid} {
				--grid-column-count: 8;
			}
			${in12ColGrid} {
				--grid-column-count: 12;
			}
			--grid-column-width: calc(
				(
						var(--rendered-grid-width) - var(--grid-gap) *
							(var(--grid-column-count) - 1)
					) / var(--grid-column-count)
			);
		}
	}
`;

export const widthInGrid = (
	columnsOrShorthand: number | GridContentWidthShorthand,
	extraGaps = 0,
	multiplier?: number,
	adjustments?: string,
	noCalc?: boolean
): string => {
	if (typeof columnsOrShorthand === "string")
		if (isGridContentWidthShorthand(columnsOrShorthand))
			return widthInGrid(
				...getColAndGapsFromShorthand(columnsOrShorthand)!,
				multiplier
			);
	const columns = columnsOrShorthand;
	let gaps = extraGaps;
	if (columns > 0) gaps += columns - 1;
	return [
		`${noCalc ? "" : "calc"}(`,
		multiplier || adjustments ? `(` : "",
		[
			columns ? `var(--grid-column-width) * ${columns}` : "",
			gaps ? `var(--grid-gap) * ${gaps}` : "",
		]
			.filter((i) => i)
			.join(" + "),
		multiplier || adjustments ? `) ` : "",
		multiplier ? `* ${multiplier}` : "",
		adjustments ? `${adjustments}` : "",
		")",
	].join("");
};

export const responsiveWidthInGrid = (
	in4Cols?: number | GridContentWidthShorthand | "all",
	in8Cols?: number | GridContentWidthShorthand | "all",
	in12Cols?: number | GridContentWidthShorthand | "all"
) => `
  ${in4Cols ? `width: ${widthInGrid(in4Cols === "all" ? 4 : in4Cols)};` : ""}
  ${
		in8Cols
			? `${in8ColGrid} {
    width: ${widthInGrid(in8Cols === "all" ? 8 : in8Cols)};
  }`
			: ""
  }
  ${
		in12Cols
			? `${in12ColGrid} {
    width: ${widthInGrid(in12Cols === "all" ? 12 : in12Cols)};
  }`
			: ""
  }
`;
export const responsiveGridColumn = (
	in4Cols?: number | string,
	in8Cols?: number | string,
	in12Cols?: number | string
) => `
  ${in4Cols ? `grid-column: ${in4Cols};` : ""}
  ${
		in8Cols
			? `${in8ColGrid} {
    grid-column: ${in8Cols};
  }`
			: ""
  }
  ${
		in12Cols
			? `${in12ColGrid} {
    grid-column: ${in12Cols};
  }`
			: ""
  }
`;

export const getWidthPcInMaxGrid = (
	columns: number,
	includeTrailingColumnGap = false,
	totalColumns = 12
) => {
	const gaps = includeTrailingColumnGap ? columns : columns - 1;
	return `${
		((GRID_GAP * gaps + GRID_COL_WIDTH_MAX * columns) /
			getGridMaxWidth(totalColumns)) *
		100
	}%`;
};

export const getWidthPxInMaxGrid = (
	columns: number,
	includePrecedingColumnGap = false,
	includeTrailingColumnGap = false,
	multiplier = 1
) => {
	let gaps = columns - 1;
	if (includePrecedingColumnGap) gaps++;
	if (includeTrailingColumnGap) gaps++;
	return `${(GRID_GAP * gaps + GRID_COL_WIDTH_MAX * columns) * multiplier}px`;
};
