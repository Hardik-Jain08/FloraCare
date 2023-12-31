import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

import {
	DecoMiniFlowerPurple,
	DecoMiniFlowerYellow,
	DecoNonagonPhone,
	DecoStickies,
	HomePageHeroIlloDesktop,
	HomePageHeroIlloPhone,
	HomePageHeroIlloTablet,
} from "@/components/graphics";
import HeroSection from "@/components/HeroSection";
import { PlantDetails } from "@/components/PlantDetails";
import { UploadFile } from "@/components/UploadFile";
import {
	fromDesktop,
	fromDesktopMl,
	fromTablet,
	fromTabletMd,
	onlyPhones,
	onlyTablets,
	uptoDesktop,
} from "@/styles/breakpointsAndMediaQueries.styles";
import { colors } from "@/styles/colors.styles";

const inter = Inter({ subsets: ["latin"] });

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
			<Head>
				<title>FloraCare</title>
			</Head>
			<HeroSection
				backgroundColor={colors.purple500}
				textColor={colors.white}
				largeHeading
				backdrop='grid'
				backdropColor={colors.purple600}
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
								<h1 className='heading animate-title'>
									<span>Flora Care</span>
								</h1>
							</HeadingGroup>
							<Description>
								<p className='font-light mt-2 text-gray-200 animate-subtitle'>
									Your pocket plant expert
								</p>
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
						<div className='grid md:grid-cols-3 justify-center animate-fade'>
							<div className='md:col-span-2'>
								<PhoneIlloWrap>
									<HomePageHeroIlloPhone />
								</PhoneIlloWrap>
								<TabletIlloWrap>
									<HomePageHeroIlloTablet />
								</TabletIlloWrap>
								<DesktopIlloWrap>
									<HomePageHeroIlloDesktop />
								</DesktopIlloWrap>
							</div>
							<UploadFile />
						</div>
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
				<PlantDetails />
			</HeroSection>
		</main>
	);
}

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
	animation: moveUpAndDown 2s ease-out infinite alternate;
`;

const DecoTopRight = styled.div`
	position: absolute;
	right: 2em;
	top: 0;
	animation: moveUpAndDown 2s ease-in-out infinite alternate;
`;

const DecoMiddleLeft = styled.div`
	position: absolute;
	right: calc(100% + 0.5em);
	bottom: 1em;
	animation: moveUpAndDown 3s ease-in infinite alternate;
`;

const DecoMiddleRight = styled.div`
	position: absolute;
	left: calc(100% - 30em);
	bottom: 5em;
	animation: moveUpAndDown 4s ease-in-out infinite;
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
	margin-left: auto;
	font-size: 1.6rem;

	> * + * {
		margin-top: 1em;
		margin-bottom: 1em;
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
