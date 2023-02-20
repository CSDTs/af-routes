import axios from "axios";
import { useEffect } from "react";
import { PuffLoader } from "react-spinners";
import useSWR from "swr";
import { Driver } from "../types";

const fetcher = (url) => fetch(url).then((r) => r.json());

function fetchRoutes(locationsArray, driversArray) {
	const { data, error, isLoading } = useSWR(TEST_API, fetcher);

	// if (!data) sendDataToMap(locationsArray, driversArray);
	return {
		routes: data,
		isLoading,
		isError: error,
	};
}

function sendDataToMap(locations: Array<Location>, drivers: Array<Driver>) {
	const MAP_APP = document.querySelector("iframe")?.contentWindow;

	if (MAP_APP) MAP_APP.postMessage({ option: "data-dump", locations: locations, drivers: drivers }, "*");
	else console.error("iFrame was not located. Please try again.");
}

let coordinates = "";
const ROOT_API = "http://127.0.0.1:5000";
const PROFILE = "";
const NEAREST_API = `${ROOT_API}/nearest/v1/${PROFILE}/${coordinates}?n`;

const TEST_API = `${ROOT_API}/table/v1/driving/polyline(egs_Iq_aqAppHzbHulFzeMe%60EuvKpnCglA)?sources=0;1;3&destinations=2;4`;

export default function CalculateRoutes({ locations, drivers }) {
	const { routes, isLoading, isError } = fetchRoutes(locations, drivers);

	if (isLoading)
		return (
			<div className="flex h-5">
				<PuffLoader color={"#000000"} loading={isLoading} size={50} />
			</div>
		);
	if (isError) return <p>Nope, error has occured.</p>;

	return (
		<>
			<p>{JSON.stringify(routes)}</p>
		</>
	);
}
