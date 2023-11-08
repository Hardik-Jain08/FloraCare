import axios from "axios";
import { useEffect, useRef, useState } from "react";

export function useIdentifyPlant() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [disabled, setDisabled] = useState<boolean>(true);
	const [currentImage, setCurrentImage] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setCurrentImage(selectedFile);
		}
	};

	const identifyPlant = async () => {
		try {
			console.log("Running");

			setLoading(true);
			setDisabled(true);
			setError(null);

			const formData = new FormData();

			if (currentImage) {
				const blob = new Blob([currentImage], {
					type: currentImage.type,
				});
				formData.append("images", blob, currentImage.name);
			}

			const response = await axios({
				method: "POST",
				url: "https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&lang=en&api-key=2b10kz1JwOTIE0xhpLqPNcLTe",
				headers: {
					"Content-Type": "multipart/form-data",
				},
				data: formData,
			});

			console.log(response.data);
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
