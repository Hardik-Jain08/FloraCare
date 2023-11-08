import Image from 'next/image'
import { Inter } from 'next/font/google'
import { styled } from "styled-components";
import { colors } from "../../styles/colors.styles";
import { GridCanvas } from "./GridCanvas";
import { maxPageContentWidthStyleObject } from "../../styles/maxPageContentWidth.styles";
import { cx } from "linaria";
import {
	fromDesktop,
	fromDesktopMd,
	fromDesktopMl,
	fromDesktopSm,
	fromTablet,
	fromTabletMd,
	onlyPhones,
	onlyTablets,
	uptoDesktop,
} from "../../styles/breakpointsAndMediaQueries.styles";
import { DecoNonagonPhone } from "@/components/graphics/DecoNonagonPhone";
import { DecoMiniFlowerPurple } from "@/components/graphics/DecoMiniFlowerPurple";
import { HomePageHeroIlloPhone } from "@/components/graphics/HomePageHeroIlloPhone";
import { HomePageHeroIlloTablet } from "@/components/graphics/HomePageHeroIlloTablet";
import { HomePageHeroIlloDesktop } from "@/components/graphics/HomePageHeroIlloDesktop";
import { DecoStickies } from "@/components/graphics/DecoStickies";
import { DecoMiniFlowerYellow } from "@/components/graphics/DecoMiniFlowerYellow";
import { getWidthPcInMaxGrid } from "../../constants/globalGrid.constants";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import Spacing from "./Spacing";

const inter = Inter({ subsets: ["latin"] });

import { createGlobalStyle } from "styled-components";
import { responsiveSizesCSSVariables } from "../../styles/responsiveSizes.styles";

const GlobalStyle = createGlobalStyle`
  ${responsiveSizesCSSVariables}
`;

export default function Home() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		setShow(true);
	}, []);

	if (!show) {
		return null;
	}

	return (
		<main
			className={`min-h-screen max-h-screen ${inter.className} relative`}
		>
			<GlobalStyle />
			<HeroSection
				backgroundColor={colors.purple500}
				textColor={colors.white}
				largeHeading
				backdrop='grid'
				backdropColor={colors.purple600}
				// backdropPositionBottom='20em'
				backdropParallax
				backdropAnimateIn
			>
				<Header>
					<TextAndIllustration>
						<LooseDecorationsSetTop>
							<DecoTopLeft>
								<DecoNonagonPhone />
							</DecoTopLeft>
							<DecoTopRight>
								<DecoMiniFlowerPurple />
							</DecoTopRight>
						</LooseDecorationsSetTop>
						<HeaderTextContent>
							<HeadingGroup>
								<h1 className='heading'>
									<span>Flora Care</span>
								</h1>
							</HeadingGroup>
							<Description>
								<p>Something about a new world!</p>
								{/* <ButtonGroupCenteredUptoDesktop>
									<SignUpButton
										appearance='filled-white'
										width='8em'
									/>
									<BookADemoButton
										appearance='outlined'
										color='white'
										width='8em'
									/>
								</ButtonGroupCenteredUptoDesktop> */}
							</Description>
						</HeaderTextContent>
						<PhoneIlloWrap>
							<HomePageHeroIlloPhone />
						</PhoneIlloWrap>
						<TabletIlloWrap>
							<HomePageHeroIlloTablet />
						</TabletIlloWrap>
						<DesktopIlloWrap>
							<HomePageHeroIlloDesktop />
						</DesktopIlloWrap>
					</TextAndIllustration>

					<LooseDecorationsSetMiddle>
						<DecoMiddleLeft>
							<DecoStickies />
						</DecoMiddleLeft>
						<DecoMiddleRight>
							<DecoMiniFlowerYellow />
						</DecoMiddleRight>
					</LooseDecorationsSetMiddle>
				</Header>
			</HeroSection>
		</main>
	);
}

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
			{hasBackground && <Spacing size='sectionPadding' />}
		</HeroSectionWrap>
	);
};

const LooseDecorationsSetBottom = styled.div`
	position: relative;
	${uptoDesktop} {
		display: none;
	}
`;

const DecoTopLeft = styled.div`
	position: absolute;
	left: 0;
	top: 0;
`;
const DecoTopRight = styled.div`
	position: absolute;
	right: 2em;
	top: 0;
`;
const DecoMiddleLeft = styled.div`
	position: absolute;
	right: calc(100% + 0.5em);
	bottom: 1em;
`;
const DecoMiddleRight = styled.div`
	position: absolute;
	left: calc(100% - 5.5em);
	bottom: 5em;
`;

const HeroSectionWrap = styled.header<{
	textColor?: string;
}>`
	width: 100%;
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

const Header = styled.div`
	position: relative;
`;

const TextAndIllustration = styled.div`
	position: relative;
	svg {
		max-width: 100%;
		height: auto;
	}
`;

const HeaderTextContent = styled.div`
	${onlyTablets} {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}
`;

const PhoneIlloWrap = styled.div`
	display: none;
	pointer-events: none;
	${onlyPhones} {
		display: block;
	}
`;

const TabletIlloWrap = styled.div`
	display: none;
	pointer-events: none;
	${fromTablet} {
		display: block;
		padding-top: 6em;
	}
	${fromTabletMd} {
		padding-top: 4em;
	}
	${fromDesktop} {
		display: none;
	}
`;

const DesktopIlloWrap = styled.div`
	display: none;
	pointer-events: none;
	${fromDesktop} {
		display: block;
		position: relative;
	}
`;

const HeadingGroup = styled.div`
	${onlyPhones} {
		padding-bottom: 2em;
	}
	${onlyTablets} {
		padding-bottom: 1em;
	}
	${fromDesktop} {
		padding-bottom: 0;
	}
	h1.heading {
		${inter}
		font-size: 5.8rem;
		font-weight: 180;
		${fromTablet} {
			font-size: 5.2rem;
		}
		${fromTabletMd} {
			font-size: 6.8rem;
			font-weight: 163;
		}
		${fromDesktop} {
			font-size: 7.6rem;
		}
	}
	h1,
	p {
		> span {
			display: block;
		}
	}
`;

const Description = styled.div`
	text-align: center;
	font-weight: 500;
	padding-bottom: 3em;
	> * + * {
		margin-top: 1em;
	}
	max-width: 25em;
	margin-left: auto;
	margin-right: auto;
	${fromDesktop} {
		position: absolute;
		left: 2.4em;
		bottom: 0;
		text-align: left;
		max-width: 20em;
		line-height: 1.25;
		font-size: 1.4rem;
		padding-bottom: 0;
	}
	${fromDesktopSm} {
		left: ${getWidthPcInMaxGrid(1, true)};
	}
	${fromDesktopMd} {
		font-size: 1.6rem;
		max-width: 18em;
		bottom: 1em;
	}
	${fromDesktopMl} {
		max-width: 20em;
	}
`;

const LogoSetWrap = styled.div`
	/* padding: 3em 0 3.5em; */
	padding-top: 3em;
	padding-bottom: 1em;
	${fromTablet} {
		/* padding: 4em 0 4.5em; */
		padding-top: 4em;
		padding-bottom: 1.5em;
	}
	${fromDesktopMl} {
		/* padding: 5em 0 5.5em; */
		padding-top: 5em;
	}
`;

const LooseDecorationsSetTop = styled.div`
	position: relative;
	margin-left: auto;
	margin-right: auto;
	max-width: 48rem;
	${fromTablet} {
		display: none;
	}
`;
const LooseDecorationsSetMiddle = styled.div`
	position: relative;
	${uptoDesktop} {
		display: none;
	}
`;
// const LooseDecorationsSetBottom = styled.div`
//   position: relative;
//   ${uptoDesktop} {
//     display: none;
//   }
// `;

const SiteNavThemeControllerPointPositioner = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
`;