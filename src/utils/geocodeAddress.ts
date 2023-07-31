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

export { fetchAddressData };
