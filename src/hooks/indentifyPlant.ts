import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { useStore } from "@/store";

export function useIdentifyPlant() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [disabled, setDisabled] = useState<boolean>(true);
	const [currentImage, setCurrentImage] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const { setPlantDetails } = useStore();

	const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setCurrentImage(selectedFile);
		}
	};

	function parsePlantDetails(data: any) {
		setPlantDetails({
			name: data.bestMatch,
			score: data.results[0].score,
			commonName: data.results[0].species.commonNames[0],
			details: {
				commonDiseases: data.plantDetails.plant_info.info.diseases.common,
				fertilizers: data.plantDetails.plant_info.info.fertilizers.requirement,
				flowers: data.plantDetails.plant_info.info.flowers.blooming_season,
				fruits: data.plantDetails.plant_info.info.fruits.harvest_time,
				growth: data.plantDetails.plant_info.info.growth.rate,
				humidity: data.plantDetails.plant_info.info.humidity.requirement,
				light: data.plantDetails.plant_info.info.light.requirement,
				propagation: data.plantDetails.plant_info.info.propagation.method,
				soil: data.plantDetails.plant_info.info.soil.requirement,
				temperature: data.plantDetails.plant_info.info.temperature.requirement,
				watering: data.plantDetails.plant_info.info.watering.requirement,
			}
		});
	}

	const identifyPlant = async () => {
		try {
			setLoading(true);
			setDisabled(true);
			setError(null);
			setPlantDetails(null);

			const formData = new FormData();

			if (currentImage) {
				const blob = new Blob([currentImage], {
					type: currentImage.type,
				});
				formData.append("images", blob, currentImage.name);
			}

			const plantImageResponse = await axios({
				method: "POST",
				url: "https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&lang=en&api-key=2b10kz1JwOTIE0xhpLqPNcLTe",
				headers: {
					"Content-Type": "multipart/form-data",
				},
				data: formData,
			});

			const commonName = plantImageResponse.data.results[0].species.commonNames[0];

			const plantDetailsResponse = await axios({
				method: 'GET',
				url: 'https://plantwise.p.rapidapi.com/plant_care/',
				params: {
					plant_type: `${commonName}`
				},
				headers: {
					'X-RapidAPI-Key': '6cd54197d5msh49f7537d5705f0ep145e1djsn9be119467a4d',
					'X-RapidAPI-Host': 'plantwise.p.rapidapi.com'
				}
			});

			const data = {
				...plantImageResponse.data,
				plantDetails: plantDetailsResponse.data
			}

			parsePlantDetails(data);
			console.log(data);
		} catch (error: any) {
			setError(error.message);
		}

		setLoading(false);
		setDisabled(false);
	};

	const onClickHandler = () => {
		identifyPlant();
	};

	const clearInput = () => {
		setError(null);
		setPlantDetails(null);
		setCurrentImage(null);
		inputRef.current!.value = "";
	};

	useEffect(() => {
		if (currentImage) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [currentImage]);

	useEffect(() => {
		return () => {
			setPlantDetails(null);
		};
	}, []);

	return {
		inputRef,
		disabled,
		currentImage,
		error,
		loading,
		clearInput,
		onImageChange,
		onClickHandler,
	};
}
