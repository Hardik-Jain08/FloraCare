export const isBrowser = typeof window !== "undefined";
export const isBuildTime = !isBrowser;

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = !isDevelopment;

export const BRANCH = process.env.GATSBY_BRANCH;
export const IS_PR_BRANCH = BRANCH !== "main";
export const IS_MAIN_BRANCH = BRANCH === "main";

export const isTinesComBuild =
	process.env.GATSBY_SITE_URL === "https://www.tines.com";

export const shouldEnablePreviewMode =
	process.env.GATSBY_PREVIEW_MODE || !isTinesComBuild;

export const isTinesComBuildOnMain =
	isTinesComBuild && IS_MAIN_BRANCH && !process.env.GATSBY_PREVIEW_MODE;
export const isPreview = IS_PR_BRANCH || process.env.GATSBY_PREVIEW_MODE;

export const checkIfIsClientAndLive = () => isBrowser && isTinesComBuildOnMain;

export const isAppleDevice = isBuildTime
	? false
	: [
			"iPad Simulator",
			"iPhone Simulator",
			"iPod Simulator",
			"iPad",
			"iPhone",
			"iPod",
	  ].some((s) => navigator.userAgent.includes(s)) ||
	  // iPad on iOS 13 detection
	  navigator.userAgent.includes("Mac");

export const isAndroidDevice = isBuildTime
	? false
	: navigator.userAgent.includes("Android");
