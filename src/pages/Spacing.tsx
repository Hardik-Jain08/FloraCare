import { cx } from "linaria";
import { styled } from "styled-components";
import { CSSProperties } from "react";
import {
	GridContentWidthShorthand,
	getColAndGapsFromShorthand,
	isGridContentWidthShorthand,
	widthInGrid,
} from "../../constants/globalGrid.constants";
import { colorsV4, withOpacity } from "../../styles/colorsV4.styles";
import {
	ResponsiveSizeName,
	isResponsiveSizeName,
	rSize,
} from "../../styles/responsiveSizes.styles";

export type SpacingProps = {
	inline?: boolean;
	size?:
		| CSSProperties["width"]
		| ResponsiveSizeName
		| GridContentWidthShorthand;
	multiplier?: number;
};

const SpacingBlock = styled.div`
	&.showGlobalGrid {
		border: 1px dashed ${colorsV4.pink};
		background-color: ${withOpacity(colorsV4.pink, 0.1)};
	}
	&.inline {
		display: inline-block;
	}
	code {
		font-size: 10px;
		font-weight: 700;
		background-color: ${withOpacity(colorsV4.pink, 0.9)};
		color: white;
		display: inline-block;
		vertical-align: top;
		white-space: nowrap;
	}
`;

const Spacing = (props: SpacingProps) => {
	const siteContext = {
		showGlobalGrid: true,
	};

	const sizeValue = props.size
		? isResponsiveSizeName(props.size)
			? rSize(props.size, props.multiplier)
			: isGridContentWidthShorthand(props.size)
			? widthInGrid(...getColAndGapsFromShorthand(props.size)!)
			: props.size
		: "1em";
	return (
		<SpacingBlock
			className={cx(
				props.inline ? "inline" : undefined,
				siteContext.showGlobalGrid && "showGlobalGrid"
			)}
			style={{
				width: sizeValue,
				height: sizeValue,
				flex: `0 0 ${sizeValue}`,
			}}
		>
			{siteContext.showGlobalGrid && (
				<code>
					{props.size ?? "1em"}
					{props.multiplier &&
						props.multiplier !== 1 &&
						` × ${props.multiplier}`}
				</code>
			)}
		</SpacingBlock>
	);
};

export default Spacing;
