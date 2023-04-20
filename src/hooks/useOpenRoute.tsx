import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";
import { useRequestStore, useRouteStore } from "../store";
import { Coordinates, Location } from "../types";
const ROOT_URL = "https://api.openrouteservice.org";
const PROFILE = "driving-car";

const API_KEY = "5b3ce3597851110001cf62483a7beda7cac74508b1b14a7700fdc281";

// const postToOpenRoute = async ({ data, method, callback }) => {
// 	// const method = saveID ? "PUT" : "POST";
// 	const directionsRoute = `${ROOT_URL}/v2/directions/${PROFILE}`;

// 	let alterProps = {
// 		method: method,
// 		headers: { Authorization: token, "Content-Type": "application/json" },
// 		credentials: "include",
// 		body: JSON.stringify(updatedSaveData),
// 	};

// 	const response = await fetch(`${WORKBOOK_API_HOST}${query}`, alterProps);
// 	return response.json();
// };

const parseCoordinates = (location: Location) => {
	return `${location?.coordinates?.longitude},${location?.coordinates?.latitude}`;
};

const parseCoordinatesToArray = (location: Location) => {
	return [location?.coordinates?.longitude, location?.coordinates?.latitude];
};

const useOpenRoute = () => {
	const { locations, setLocations } = useRouteStore(
		(state) => ({ locations: state.locations, setLocations: state.setLocations }),
		shallow
	);
	const [drivers, setDrivers] = useState<any[]>([]);

	const { cachedDirections, appendMap } = useRequestStore(
		(state) => ({ cachedDirections: state.cachedDirections, appendMap: state.appendMap }),
		shallow
	);

	const getDirections = async (locationA: Location, locationB: Location) => {
		const parsedLocationA = parseCoordinates(locationA);
		const parsedLocationB = parseCoordinates(locationB);

		const address = `${ROOT_URL}/v2/directions/${PROFILE}`;

		if (cachedDirections.has(`${parsedLocationA}-${parsedLocationB}`)) {
			console.log("getting from cache");
			return cachedDirections.get(`${parsedLocationA}-${parsedLocationB}`);
		}
		const response = await axios.get(address, {
			params: {
				api_key: API_KEY,
				start: parsedLocationA,
				end: parsedLocationB,
			},
		});

		if (!response.data) throw new Error("Could not get directions. Please try again later..");

		console.log("appending to cache");
		appendMap("cachedDirections", `${parsedLocationA}-${parsedLocationB}`, response.data);

		return response.data;
	};

	const getDirectionsAdvanced = async () => {
		const address = `${ROOT_URL}/v2/directions/${PROFILE}/geojson`;

		const coordinates = locations.map((location) => {
			return parseCoordinatesToArray(location);
		});
		const coordinatesKey = coordinates.flat().toString();
		if (cachedDirections.has(coordinatesKey)) {
			console.log("getting from cache");
			return cachedDirections.get(coordinatesKey);
		}

		const params = {
			coordinates: coordinates,
		};

		const headers = {
			Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
			Authorization: API_KEY,
		};

		const response = await axios.post(address, params, {
			headers: headers,
		});

		console.log(response);

		if (!response.data) throw new Error("Could not get directions. Please try again later..");

		console.log("appending to cache");
		appendMap("cachedDirections", coordinatesKey, response.data);

		return response.data;
	};

	return { getDirections, getDirectionsAdvanced };
};

export default useOpenRoute;
