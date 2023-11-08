import gsap from "gsap";
import { useEffect, useRef } from "react";
// @ts-ignore
import Lottie from "react-lottie";

import { useStore } from "@/store";

import lottie from "../../public/lottie2.json";

export function PlantDetails() {
	const { plantDetails } = useStore();

	const lottieFooterAnimation = {
		loop: true,
		autoplay: true,
		animationData: lottie,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	return (
		<div>
			{plantDetails && (
				<div className='text-5xl text-center py-10 flex gap-4 flex-col'>
					<h3 className='text-3xl md:text-5xl'>
						{plantDetails.name}
					</h3>
					<div className='flex flex-col md:flex-row gap-4 md:gap-12 justify-center text-lg md:text-2xl font-light text-gray-300'>
						<span>Score: {plantDetails.score}</span>
						<span>Common Name: {plantDetails.commonName}</span>
					</div>
				</div>
			)}
			<Lottie options={lottieFooterAnimation} />
		</div>
	);
}
