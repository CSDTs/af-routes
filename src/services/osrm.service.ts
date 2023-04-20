import axios from "axios";

import { Coordinates, Location } from "../types";

const addAllDropOffPoints = (locations: Array<Location>) => {
	const MAP_APP = document.querySelector("iframe")?.contentWindow;

	if (MAP_APP) MAP_APP.postMessage({ option: "add-all-dropoffs", locations: locations }, "*");
	else console.error("iFrame was not located. Please try again.");
};

/**
 * Communicates with iframe via postmessage to send data for OSRM frontend.
 *
 * Ideally, this will be updated to use better standards. For now, CORS sucks and this unblocks me to continue working...
 * @param coordinates Latitude and longitude object from locations data
 */

const addPointToMap = (coordinates: Coordinates) => {
	const MAP_APP = document.querySelector("iframe")?.contentWindow;

	if (MAP_APP)
		MAP_APP.postMessage({ option: "add-waypoint", lat: coordinates?.latitude, lng: coordinates?.longitude }, "*");
	else console.error("iFrame was not located. Please try again.");
};
const fetchLocationCoordinates = (url: string, params: { address: string }) => axios.get(url).then((res) => res.data);
const OSRMService = {
	addAllDropOffPoints,
};

export default OSRMService;
