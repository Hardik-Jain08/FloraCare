import gsap from "gsap";
import { useEffect, useRef } from "react";

import { useStore } from "@/store";

export function PlantDetails() {
	const { plantDetails } = useStore();

	return (
		<div className='text-5xl text-center py-10 flex gap-4 flex-col'>
			<h3>{plantDetails?.name}</h3>
			<p className='text-2xl font-light text-gray-300'>
				Score: {plantDetails?.score}
			</p>
		</div>
	);
}
