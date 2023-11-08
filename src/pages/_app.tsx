import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";

import { StoreContext, useInitializeStore } from "@/store";
import { responsiveSizesCSSVariables } from "@/styles/responsiveSizes.styles";

const GlobalStyle = createGlobalStyle`
    ${responsiveSizesCSSVariables}
    `;

export default function App({ Component, pageProps }: AppProps) {
	const initalStoreState = useInitializeStore();

	return (
		<StoreContext.Provider value={initalStoreState}>
			<GlobalStyle />
			<Component {...pageProps} />
		</StoreContext.Provider>
	);
}
