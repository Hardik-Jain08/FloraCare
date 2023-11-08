import { css, styled } from "styled-components";
import {
	breakpoints,
	fromDesktopLg,
} from "./breakpointsAndMediaQueries.styles";
import { rSize } from "./responsiveSizes.styles";

export const maxPageContentWidth = breakpoints.desktopLg;
export const fromMaxPageWidthBreakpoint = fromDesktopLg;

export const maxPageContentWidthStyleObject = {
	width: "100%",
	maxWidth: maxPageContentWidth,
	marginLeft: "auto",
	marginRight: "auto",
	paddingLeft: rSize("pageMargin"),
	paddingRight: rSize("pageMargin"),
};

export const maxPageContentWidthCss = css`
	${maxPageContentWidthStyleObject}
`;

export const WithMaxPageContentWidth = styled.div`
	${maxPageContentWidthStyleObject}
`;
