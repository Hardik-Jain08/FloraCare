import { css } from "linaria";
import { fromDesktop } from "../styles/breakpointsAndMediaQueries.styles";
import { colorsV4, withOpacity } from "../styles/colorsV4.styles";
import { zIndex } from "../styles/zIndexes.styles";
import { darkModeLinariaCSS } from "./colorScheme.utils";
import { makeRandomId } from "./id.utils";
import { resolveAfter } from "./promises.utils";

export const renderNotice = async (notice: string, duration?: number) => {
	const { id, banner } = setNotice(notice);
	if (duration) {
		await resolveAfter(duration);
		banner.remove();
	}
	return { id, banner };
};

export const flashNotice = async (notice: string, duration = 5000) => {
	return renderNotice(notice, duration);
};

const animateBannerClose = async (el?: Element | null) => {
	if (!el) return;
	el.classList.add("closing");
	await resolveAfter(500);
	el.remove();
};

export const clearNotice = (id?: string) => {
	if (id) {
		animateBannerClose(
			document.querySelector(`.NoticeBannerContainer [id="${id}"]`)
		);
	} else {
		document
			.querySelectorAll(`.NoticeBannerContainer > *`)
			.forEach((el) => {
				animateBannerClose(el);
			});
	}
};

const setNotice = (notice: string) => {
	const id = `NoticeBanner_${makeRandomId()}`;
	const banner = document.createElement("div");
	banner.id = id;
	banner.classList.add("NoticeBanner");
	banner.innerHTML = /<p/.test(notice) ? notice : `<p>${notice}</p>`;
	banner.addEventListener("click", () => {
		clearNotice(id);
	});
	if (/<img/.test(banner.innerHTML)) banner.classList.add("hasImage");
	let container = document.querySelector(".NoticeBannerContainer");
	if (!container) {
		container = document.createElement("div");
		container.classList.add("NoticeBannerContainer");
		document.body.append(container);
	}
	container.appendChild(banner);
	return { id, banner };
};

export const noticeBannerStyle = css`
	:global() {
		.NoticeBannerContainer {
			position: fixed;
			bottom: 1em;
			left: 1em;
			right: 1em;
			z-index: ${zIndex("NoticeBannerContainer")};
			display: flex;
			flex-direction: column;
			pointer-events: none;
			justify-content: center;
			pointer-events: none;
		}
		.NoticeBanner {
			padding: 0.75em 1em;
			border-radius: 0.75em;
			background-color: ${colorsV4.warmBlack};
			color: ${colorsV4.white};
			max-width: 100%;
			border: 1px solid ${withOpacity(colorsV4.white, 0.2)};
			box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.2);
			font-size: 1.4rem;
			font-weight: 500;
			pointer-events: auto;
			margin-left: auto;
			margin-right: auto;
			text-align: center;
			transition: 0.3s;
			pointer-events: auto;
			&:active {
				transition: 0.1s;
				transform: scale(0.9);
			}
			@supports (backdrop-filter: blur(1em)) {
				background-color: ${withOpacity(colorsV4.warmBlack900, 0.7)};
				backdrop-filter: blur(1em);
			}
			&.hasImage {
				border-radius: 1.25em;
			}
			@keyframes NoticeBannerEnter {
				from {
					transform: translateY(100%) scale(0.8);
					opacity: 0;
				}
				to {
					transform: translateY(0);
					opacity: 1;
				}
			}
			animation: NoticeBannerEnter 0.5s
				cubic-bezier(0.075, 0.82, 0.165, 1);
			${darkModeLinariaCSS(`
        background-color: ${colorsV4.canvas300};
        color: ${colorsV4.warmBlack};
        @supports (backdrop-filter: blur(1em)) {
          background-color: ${withOpacity(colorsV4.canvas300, 0.7)};
          backdrop-filter: blur(1em);
        }
      `)};
			> img {
				display: block;
				margin-top: -1rem;
				margin-left: auto;
				margin-right: auto;
				width: 6rem;
				${fromDesktop} {
					width: 7rem;
				}
				height: auto;
			}
			&.closing {
				transition: 0.5s;
				transform: scale(0.8);
				opacity: 0;
			}
			+ * {
				margin-top: 0.25em;
			}
		}
	}
`;
