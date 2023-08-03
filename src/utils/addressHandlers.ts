import axios from "axios";

const provider = `https://nominatim.openstreetmap.org`;

const fetchAddressesForAutoComplete = (address: string, callback: (data: any) => void) => {
	const params = encodeURIComponent(address);

	if (address != "")
		axios
			.get(`${provider}/search/?format=json&q=${params}`)
			.then((response) => {
				console.log(response.data);
				console.log(response.data[0]);

				callback(response.data);

				// setCoordinates({ latitude: response.data.data[0].latitude, longitude: response.data.data[0].longitude });
				// handleCoordinateUpdate(count.idx, coordinates);
			})
			.catch((error) => {
				console.log(error);
			});
};
