import axios from "axios";

const useNominatim = () => {
	const reverseGeocode = async (coordinates) => {
		const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
			params: {
				lat: coordinates.lat,
				lon: coordinates.lon,
				format: "json",
			},
		});

		const data = await response.data();

		return data.display_name;
	};

	return {
		reverseGeocode,
	};
};

export default useNominatim;
