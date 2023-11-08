<<<<<<< HEAD
import { Head, Html, Main, NextScript } from "next/document";
=======
import { Html, Head, Main, NextScript } from 'next/document'
import { responsiveSizesCSSVariables } from "../styles/responsiveSizes.styles";

>>>>>>> parent of 1e9029d (logo icon and title added with import fixes)
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
