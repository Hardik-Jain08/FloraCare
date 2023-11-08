import { Html, Head, Main, NextScript } from "next/document";
import { responsiveSizesCSSVariables } from "@/styles/responsiveSizes.styles";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ${responsiveSizesCSSVariables}
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <GlobalStyle />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
