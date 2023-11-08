import { Head, Html, Main, NextScript } from "next/document";
import { createGlobalStyle } from "styled-components";

import { responsiveSizesCSSVariables } from "@/styles/responsiveSizes.styles";

const GlobalStyle = createGlobalStyle`
  ${responsiveSizesCSSVariables}
`;

export default function Document() {
	return (
		<Html lang='en'>
			<Head />
			<body>
				<GlobalStyle />
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
