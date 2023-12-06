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
				<div className='text-5xl text-center p-10 rounded-xl shadow-2xl flex gap-4 flex-col bg-gray-500/50'>
					<h3 className='text-3xl md:text-5xl'>
						{plantDetails.commonName}
					</h3>
					<div className='flex flex-col md:flex-row gap-4 md:gap-12 justify-center text-lg md:text-2xl font-light text-gray-300'>
						<span>Score: {plantDetails.score}</span>
						<span>Scientific Name: {plantDetails.name}</span>
					</div>

					<ul>
						{Object.keys(plantDetails.details).map((key) => {
							const value = plantDetails.details[key];

							return (
								<li key={key} className='mb-6 text-base text-left md:text-2xl capitalize font-light text-gray-300'>
									<span>{key}: </span>
									<span>{value}</span>
								</li>
							);
						})}
					</ul>

				</div>
			)}
			<Lottie options={lottieFooterAnimation} />
		</div>
	);
}
