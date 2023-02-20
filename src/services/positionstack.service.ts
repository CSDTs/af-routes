import axios from "axios";

import { Coordinates } from "../types";

const convertToCoordinates = (address: string, callback: (data: Array<any>) => void) => {
	const params = {
		access_key: `${import.meta.env.VITE_POSITION_STACK_KEY}`,
		query: address,
	};

	console.log(import.meta.env.VITE_POSITION_STACK_URL);
	axios
		.get(`${import.meta.env.VITE_POSITION_STACK_URL}`, { params })
		.then((response) => {
			console.log(response.data);
			console.log(response.data.data[0]);

			callback(response.data.data);

			// setCoordinates({ latitude: response.data.data[0].latitude, longitude: response.data.data[0].longitude });
			// handleCoordinateUpdate(count.idx, coordinates);
		})
		.catch((error) => {
			console.log(error);
		});
};

const PositionStackService = {
	convertToCoordinates,
};

export default PositionStackService;
