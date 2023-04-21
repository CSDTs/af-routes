import { useId } from "react";
import { useRequestStore, useRouteStore } from "../../store";
import RouteResults from "../RouteResults";
import { Header, Subheader } from "../atoms";
import { LocationTable } from "../molecules";

import uniqueId from "lodash/uniqueId";
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

import useOpenRoute from "../../hooks/useOpenRoute";
import { convertToEpoch } from "../../utils/convertDate";

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
	const jobs = locations.map((loc) => {
		return {
			id: parseInt(uniqueId()),
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
			id: parseInt(uniqueId()),
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

	const testData = {
		jobs: [
			{
				id: 1,
				description: "test",
				service: 300,
				amount: [1],
				location: [1.98465, 48.70329],
				skills: [1],
				time_windows: [[32400, 36000]],
			},
			{ id: 2, description: "test", service: 300, amount: [1], location: [2.03655, 48.61128], skills: [1] },
			{ id: 3, description: "test", service: 300, amount: [1], location: [2.39719, 49.07611], skills: [1] },
			{ id: 4, description: "test", service: 300, amount: [1], location: [2.41808, 49.22619], skills: [1] },
			{ id: 5, description: "test", service: 300, amount: [1], location: [2.28325, 48.5958], skills: [1] },
			{ id: 6, description: "test", service: 300, amount: [1], location: [2.89357, 48.90736], skills: [1] },
		],
		vehicles: [
			{
				id: 1,
				profile: "driving-car",
				start: [2.35044, 48.71764],
				end: [2.35044, 48.71764],
				capacity: [4],
				skills: [1],
				time_window: [28800, 43200],
			},
			{
				id: 2,
				profile: "driving-car",
				start: [2.35044, 48.71764],
				end: [2.35044, 48.71764],
				capacity: [4],
				skills: [1],
				time_window: [28800, 43200],
			},
		],
	};

	const optimizationData = {
		jobs,
		vehicles,
	};
	const { getOptimization } = useOpenRoute();
	const setOptimization = useRequestStore((state) => state.setOptimization);
	const getRoutes = () => {
		getOptimization(optimizationData).then((data) => {
			setOptimization(data);
		});
	};
	const optimization = useRequestStore((state) => state.optimization);

	return (
		<>
			<Header>Calculate Routes</Header>
			<Subheader>Based on these results, generate routes!</Subheader>

			{optimizationData && (
				<button
					className={`mt-8 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-lg font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 cursor-pointer`}
					onClick={getRoutes}>
					Generate my routes
				</button>
			)}

			{/* <RouteResults /> */}
		</>
	);
};

export default CalculationsTab;
