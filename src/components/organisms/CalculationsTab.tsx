import uniqueId from "lodash/uniqueId";
import { useEffect, useId } from "react";
import routesData from "../../data/routes.json";
import useOpenRoute from "../../hooks/useOpenRoute";
import { useRequestStore, useRouteStore } from "../../store";
import RouteResults from "../RouteResults";
import { Header, Subheader } from "../atoms";
import { LocationTable } from "../molecules";
type TimeWindow = [number, number];
type Coordinates = [number, number]; //lon, lat
type Break = {
	id: number;
	time_windows: TimeWindow[];
	service: number;
	description: string;
	max_load: number[];
};
interface Job {
	id: number;
	description?: string; //address
	location: Coordinates; //coordinates
	setup?: number;
	service: number; //drop off
	priority: number;
	time_windows: TimeWindow[];
}

interface Vehicle {
	id: number;
	description?: string; //name
	start: Coordinates; //coordinates
	time_window: TimeWindow;
	breaks: Break[];
	max_travel_time: number;
	max_tasks: number; //max stops
}

type Geometry = {
	type: string;
	coordinates: Coordinates[];
};

type Step = {
	id?: number;
	service?: number;
	waiting_time?: number;
	job?: number;
	type: string;
	location: Coordinates;
	load: number[];
	arrival: number;
	duration: number;
	distance: number;
};
type Route = {
	vehicle: number;
	cost: number;
	delivery: number[];
	amount: number[];
	pickup: number[];
	service: number;
	duration: number;
	waiting_time: number;
	distance: number;
	steps: Step[];
	geometry: string;
};
type Data = {
	code: number;
	summary: {
		cost: number;
		unassigned: number;
		delivery: number[];
		amount: number[];
		pickup: number[];
		service: number;
		duration: number;
		waiting_time: number;
		distance: number;
		computing_times: {
			loading: number;
			solving: number;
			routing: number;
		};
	};
	unassigned: any[];
	routes: Route[];
};

interface Result {
	geometry: Geometry[];
	data: Data;
}
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
function convertHMS(timeString: string) {
	const arr: string[] = timeString.split(":");
	const seconds: number = parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60;
	return seconds;
}
const handleTimeWindow = (window: [string, string]) => {
	return [convertHMS(window[0]), convertHMS(window[1])];
};
const CalculationsTab = () => {
	const locations = useRouteStore((state) => state.locations);
	const drivers = useRouteStore((state) => state.drivers);

	const driversMap = new Map(drivers.map((obj) => [obj.id, obj]));
	const locationsMap = new Map(locations.map((obj) => [obj.id, obj]));

	const { getOptimization } = useOpenRoute();
	const optimization = useRequestStore((state) => state.optimization);
	const setOptimization = useRequestStore((state) => state.setOptimization);
	const appendMap = useRequestStore((state) => state.appendMap);
	const cachedOptimizations = useRequestStore((state) => state.cachedOptimizations);

	const getRoutes = () => {
		getOptimization().then((data) => {
			setOptimization(data);
		});
	};
	function formatTime(seconds: number): string {
		const date = new Date(seconds * 1000);
		const hours = date.getUTCHours();
		const minutes = date.getUTCMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
	}
	const getRoutesDev = async () => {
		console.log(routesData);
		console.log(drivers);
		console.log(driversMap);

		const uniqueKey = await getUniqueKey({ locations, drivers }).then((data) => {
			return data;
		});
		if (cachedOptimizations.has(uniqueKey)) {
			console.log("getting from cache");
			setOptimization(cachedOptimizations.get(uniqueKey));
		} else {
			appendMap("cachedOptimizations", uniqueKey, routesData);
			setOptimization(routesData);
		}
	};
	const colors = ["border-red-700", "border-blue-700", "border-green-700", "border-purple-700", "border-teal-400"];
	const hexColors = ["#b91c1c", "#1d4ed8", "#15803d", "#7e22ce", "#334155"];
	const shadowColors = [
		"shadow-red-700",
		"shadow-blue-700",
		"shadow-green-700",
		"shadow-purple-700",
		"shadow-teal-400",
	];
	return (
		<>
			<Header>Calculate Routes</Header>
			<Subheader>Based on these results, generate routes!</Subheader>

			{/* {optimizationData && (
				<button
					className={`mt-8 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-lg font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 cursor-pointer`}
					onClick={getRoutes}>
					Generate my routes
				</button>
			)} */}

			<div className="flex flex-col gap-2">
				{optimization &&
					optimization?.data.routes.map((route) => {
						return (
							<div
								className={" p-2 bg-slate-50  " + " shadow " + shadowColors[route.vehicle % colors.length]}
								key={route.vehicle}>
								<p className="pb-2 text-slate-800 font-bold">
									{" "}
									{driversMap.get(route.vehicle)?.name} (
									<span>
										{formatTime(route.steps[0].arrival)} to {formatTime(route.steps[route.steps.length - 1].arrival)}
									</span>
									)
								</p>
								<h2 className="text-base font-semibold text-slate-700 ">Route</h2>
								<ul role="list" className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500">
									<li>
										<span className="w-full flex text-sm font-medium">Starting Location:</span>{" "}
										<span className="w-full flex text-sm text-slate-700 font-base">
											{driversMap.get(route.vehicle)?.address}
										</span>
									</li>
									{route.steps.map((step, idx) => (
										<>
											{step.id && (
												<li>
													<span className="w-full flex text-sm font-medium ">Stop {idx}:</span>{" "}
													<span className="w-full flex text-sm text-slate-700 font-base">
														{locationsMap.get(step.id)?.address}
													</span>
												</li>
											)}
										</>
									))}
									<li>
										<span className="w-full flex text-sm font-medium">Ending Location:</span>{" "}
										<span className="w-full flex text-sm text-slate-700 font-base">
											{driversMap.get(route.vehicle)?.address}
										</span>
									</li>
								</ul>

								<span></span>
							</div>
						);
					})}

				<button
					className={`mt-8 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-lg font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 cursor-pointer`}
					onClick={getRoutes}>
					{optimization ? "Regenerate" : "Generate"} my routes
				</button>
			</div>

			{/* <RouteResults /> */}
		</>
	);
};

export default CalculationsTab;
