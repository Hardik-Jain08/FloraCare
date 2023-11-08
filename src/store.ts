import React, { createContext, useContext, useState } from "react";

interface PlantDetails {
	name: string;
	commonName: string;
	score: number;
}

interface Store {
	plantDetails: PlantDetails | null;
	setPlantDetails: React.Dispatch<React.SetStateAction<PlantDetails | null>>;
}

export const StoreContext = createContext<Store | null>(null);

export const useStore = () => {
	const context = useContext(StoreContext);

	if (!context) {
		throw new Error("useStore must be used within a StoreProvider");
	}

	return context;
};

export const useInitializeStore = () => {
	const [plantDetails, setPlantDetails] = useState<PlantDetails | null>(null);

	return {
		plantDetails,
		setPlantDetails,
	};
};
