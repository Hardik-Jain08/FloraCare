import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			animation: {
				fade: "smoothAnimate 200ms ease-in-out",
				title: "fadeIn 300ms ease-in-out",
				subtitle: "fadeIn 400ms ease-in-out",
			},
			// @ts-ignore
			keyframes: (theme: any) => ({
				fadeIn: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				smoothAnimate: {
					"0%": { transform: "translateY(0px)", opacity: 0 },
					"40%": { transform: "translateY(-16px)", opacity: 0 },
					"100%": { transform: "translateY(0px)", opacity: 1 },
				},
			}),
		},
	},
	plugins: [],
};
export default config
