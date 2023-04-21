import polyline from "@mapbox/polyline";
import axios from "axios";
import uniqueId from "lodash/uniqueId";
import { useState } from "react";
import { useQuery } from "react-query";
import { shallow } from "zustand/shallow";
import { useRequestStore, useRouteStore } from "../store";
import { Coordinates, Location } from "../types";

const ROOT_URL = "https://api.openrouteservice.org";
const PROFILE = "driving-car";

const API_KEY = "5b3ce3597851110001cf62483a7beda7cac74508b1b14a7700fdc281";

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
function convertHMS(timeString: string) {
	const arr: string[] = timeString.split(":");
	const seconds: number = parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60;
	return seconds;
}
const handleTimeWindow = (window: [string, string]) => {
	return [convertHMS(window[0]), convertHMS(window[1])];
};
const useOpenRoute = () => {
	const locations = useRouteStore((state) => state.locations);
	const drivers = useRouteStore((state) => state.drivers);

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
	const getOptimization = async () => {
		const address = `${ROOT_URL}/optimization`;

		const jobs = locations.map((loc) => {
			return {
				id: loc.id,
				description: loc.address,
				service: loc.drop_off_duration,
				amount: [1],
				location: [loc.coordinates?.longitude, loc.coordinates?.latitude],
				skills: [1],
				priority: loc.priority,
				time_windows: loc.time_windows.map((window) => {
					return handleTimeWindow(window);
				}),
			};
		});
		const vehicles = drivers.map((loc) => {
			return {
				id: loc.id,
				profile: "driving-car",
				description: loc.name,
				start: [loc.coordinates?.longitude, loc.coordinates?.latitude],
				end: [loc.coordinates?.longitude, loc.coordinates?.latitude],
				// max_travel_time: loc.max_travel_time,
				// max_tasks: loc.max_stops,
				capacity: [4],
				skills: [1],
				// breaks: loc.break_slots.map((slot) => {
				// 	return { ...slot, id: parseInt(uniqueId()) };
				// }),
				time_window: handleTimeWindow(loc.time_window),
			};
		});

		const data = { jobs, vehicles };

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

		const geometry = response.data.routes.map((route: any) => {
			return polyline.toGeoJSON(route.geometry);
		});

		const coloredGeometry = geometry.map((route, idx) => {
			return { ...route, properties: { color: response.data.routes[idx].vehicle } };
		});

		if (!response.data) throw new Error("Could not get directions. Please try again later..");
		console.log(coloredGeometry);
		console.log("appending to cache");
		appendMap("cachedOptimizations", uniqueKey, { geometry, data: response.data });

		return { geometry, data: response.data };
	};
	return { getDirections, getDirectionsAdvanced, getOptimization };
};

export default useOpenRoute;
