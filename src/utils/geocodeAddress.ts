import axios from "axios";

const fetchAddressData = async (query: string) => {
	const response = await axios.get("https://nominatim.openstreetmap.org/search", {
		params: {
			q: query,
			format: "json",
		},
	});

	const data = response.data;

	return data;
};

const lookupAddress = async (lat: string, lon: string) => {
	const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
		params: {
			lat,
			lon,
			format: "json",
		},
	});

	const data = response.data;

	return data;
};
export { fetchAddressData, lookupAddress };
