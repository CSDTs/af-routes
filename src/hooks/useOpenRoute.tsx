import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";
import { useRequestStore, useRouteStore } from "../store";
import { Coordinates, Location } from "../types";

import polyline from "@mapbox/polyline";
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
const getUniqueKey = async (obj: Object) => {
	// Convert the object to a string using JSON.stringify
	const objString = JSON.stringify(obj);

	// Hash the string using a hash function (here, we use the built-in SHA-256 algorithm)
	const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(objString));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

	// Return the hashed string as the unique key
	return hashHex;
};
const parseCoordinates = (location: Location) => {
	return `${location?.coordinates?.longitude},${location?.coordinates?.latitude}`;
};

const parseCoordinatesToArray = (location: Location) => {
	return [location?.coordinates?.longitude, location?.coordinates?.latitude];
};
/**
 * Decode an x,y or x,y,z encoded polyline
 * @param {*} encodedPolyline
 * @param {Boolean} includeElevation - true for x,y,z polyline
 * @returns {Array} of coordinates
 */
const decodePolyline = (encodedPolyline, includeElevation) => {
	// array that holds the points
	let points = [];
	let index = 0;
	const len = encodedPolyline.length;
	let lat = 0;
	let lng = 0;
	let ele = 0;
	while (index < len) {
		let b;
		let shift = 0;
		let result = 0;
		do {
			b = encodedPolyline.charAt(index++).charCodeAt(0) - 63; // finds ascii
			// and subtract it by 63
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);

		lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
		shift = 0;
		result = 0;
		do {
			b = encodedPolyline.charAt(index++).charCodeAt(0) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;

		if (includeElevation) {
			shift = 0;
			result = 0;
			do {
				b = encodedPolyline.charAt(index++).charCodeAt(0) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
			ele += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
		}
		try {
			let location = [lat / 1e5, lng / 1e5];
			if (includeElevation) location.push(ele / 100);
			points.push(location);
		} catch (e) {
			console.log(e);
		}
	}
	return points;
};
const useOpenRoute = () => {
	const { locations, setLocations } = useRouteStore(
		(state) => ({ locations: state.locations, setLocations: state.setLocations }),
		shallow
	);

	const { drivers, setDrivers } = useRouteStore(
		(state) => ({ drivers: state.drivers, setDrivers: state.setDrivers }),
		shallow
	);

	const { cachedDirections, appendMap } = useRequestStore(
		(state) => ({ cachedDirections: state.cachedDirections, appendMap: state.appendMap }),
		shallow
	);

	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);

	const cachedOptimizations = useRequestStore((state) => state.cachedOptimizations);

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
	const getOptimization = async (data: any) => {
		const address = `${ROOT_URL}/optimization`;
		const uniqueKey = await getUniqueKey({ locations, drivers }).then((data) => {
			return data;
		});

		if (cachedOptimizations.has(uniqueKey)) {
			console.log("getting from cache");
			return cachedOptimizations.get(uniqueKey);
		}
		const params = {
			jobs: data.jobs,
			vehicles: data.vehicles,
			options: {
				g: true,
			},
		};

		const headers = {
			Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
			Authorization: API_KEY,
		};

		const response = await axios.post(address, params, {
			headers: headers,
		});

		const geometry = response.data.routes.map((route) => {
			return polyline.toGeoJSON(route.geometry);
		});

		if (!response.data) throw new Error("Could not get directions. Please try again later..");

		console.log("appending to cache");
		appendMap("cachedOptimizations", uniqueKey, { geometry, data: response.data });

		return response.data;
	};
	return { getDirections, getDirectionsAdvanced, getOptimization };
};

export default useOpenRoute;
