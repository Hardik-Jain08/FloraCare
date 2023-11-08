import { cx } from "linaria";
import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

import { colors } from "@/styles/colors.styles";
import { maxPageContentWidthStyleObject } from "@/styles/maxPageContentWidth.styles";

import { GridCanvas } from "./GridCanvas";
import Spacing from "./Spacing";

const HeroSection = (
	props: PropsWithChildren<{
		largeHeading?: boolean;
		backgroundColor?: string;
		textColor?: string;
		backdrop?: "grid" | "dots";
		backdropColor?: string;
		backdropPositionBottom?: string;
		/** only available to the grid design */
		backdropParallax?: boolean;
		/** only available to the grid design */
		backdropAnimateIn?: boolean;
		backdropLayerChildren?: ReactNode;
	}>
) => {
	const backdropColor = props.backdropColor ?? colors.purple100;
	const hasBackground = props.backdrop || props.backdropColor;

	return (
		<HeroSectionWrap textColor={props.textColor}>
			<Spacing size='xxl' />
			{hasBackground && (
				<HeroSectionBackdropLayer
					id='HeroSectionBackdropLayer'
					backgroundColor={props.backgroundColor}
					offsetBottom={props.backdropPositionBottom}
				>
					<GridCanvas
						color={backdropColor}
						addBorderBottom
						parallax={props.backdropParallax}
						animateIn={props.backdropAnimateIn}
					/>
					{props.backdropLayerChildren}
				</HeroSectionBackdropLayer>
			)}
			<Content className={cx(props.largeHeading && "largeHeading")}>
				{props.children}
			</Content>
		</HeroSectionWrap>
	);
};

export default HeroSection;

const HeroSectionWrap = styled.header<{
	textColor?: string;
}>`
	width: 100%;
	height: 100vh;
	position: relative;
	text-align: center;
	color: ${(p) => p.textColor ?? "inherit"};
`;

export const HeroSectionBackdropLayer = styled.div<{
	backgroundColor?: string;
	offsetBottom?: string;
}>`
	position: absolute;
	top: 0;
	right: 0;
	background-color: ${(p) => p.backgroundColor ?? "transparent"};
	bottom: ${(p) => p.offsetBottom || "0"};
	left: 0;
`;

const Content = styled.div`
	${maxPageContentWidthStyleObject}
	position: relative;
	h1 {
		font-weight: 300;
		line-height: 0.97;
		text-wrap: balance; // supported in Chrome but not in safari
		> span {
			display: block;
		}
		+ * {
			margin-top: 1.5em;
		}
	}
	> * {
		+ h1 {
			margin-top: 3.2rem;
		}
	}
	&.largeHeading {
		h1 {
		}
		> * {
			+ h1 {
				margin-top: 4.8rem;
			}
		}
	}
	p {
		margin-left: auto;
		margin-right: auto;
	}
`;
