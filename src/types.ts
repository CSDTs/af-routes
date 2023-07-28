export interface Coordinates {
	latitude: number | string;
	longitude: number | string;
}

export type TimeWindow = { startTime: string; endTime: string };

type Break = {
	id: number;
	time_windows: TimeWindow[];
	service: number;
	description: string;
	max_load: number[];
};
export interface Driver {
	id: number;
	name: string;
	address: string;
	coordinates: Coordinates | null;
	time_window: TimeWindow;
	max_travel_time: number;
	max_stops: number;
	break_slots: Break[];
	raw_data?: any;
	available_options?: any;
}

export interface Location {
	id: number;
	address: string;
	customer_name?: string;
	coordinates?: Coordinates | null;
	drop_off_duration: number;
	priority: number;
	time_windows: TimeWindow[];
	raw_data?: any;
	available_options?: any;
}
interface OptimizationJob {
	id: number;
	service: number;
	amount: number[];
	location: number[];
	skills: number[];
	time_windows: Array<number[]>;
}

interface OptimizationVehicle {
	id: number;
	profile: string;
	start: number[];
	end: number[];
	capacity: number[];
	skills: number[];
	time_window: number[];
}
export type TableData = {
	title: string;
	subTitle: string;
	columns: string[];
	dataKey: string;
	populationData: any;
};
export type Step = {
	id?: number;
	service?: number;
	waiting_time?: number;
	job?: number;
	type?: string;
	location: Coordinates;
	load: number[];
	arrival: number;
	duration: number;
	distance: number;
	geometry?: string;
};
export type Route = {
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
export type Data = {
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
// type TimeWindow = [number, number];
// type Coordinates = [number, number]; //lon, lat
// type Break = {
// 	id: number;
// 	time_windows: TimeWindow[];
// 	service: number;
// 	description: string;
// 	max_load: number[];
// };
// interface Job {
// 	id: number;
// 	description?: string; //address
// 	location: Coordinates; //coordinates
// 	setup?: number;
// 	service: number; //drop off
// 	priority: number;
// 	time_windows: TimeWindow[];
// }

// interface Vehicle {
// 	id: number;
// 	description?: string; //name
// 	start: Coordinates; //coordinates
// 	time_window: TimeWindow;
// 	breaks: Break[];
// 	max_travel_time: number;
// 	max_tasks: number; //max stops
// }

// type Geometry = {
// 	type: string;
// 	coordinates: Coordinates[];
// };

// type Step = {
// 	id?: number;
// 	service?: number;
// 	waiting_time?: number;
// 	job?: number;
// 	type: string;
// 	location: Coordinates;
// 	load: number[];
// 	arrival: number;
// 	duration: number;
// 	distance: number;
// };
// type Route = {
// 	vehicle: number;
// 	cost: number;
// 	delivery: number[];
// 	amount: number[];
// 	pickup: number[];
// 	service: number;
// 	duration: number;
// 	waiting_time: number;
// 	distance: number;
// 	steps: Step[];
// 	geometry: string;
// };
// type Data = {
// 	code: number;
// 	summary: {
// 		cost: number;
// 		unassigned: number;
// 		delivery: number[];
// 		amount: number[];
// 		pickup: number[];
// 		service: number;
// 		duration: number;
// 		waiting_time: number;
// 		distance: number;
// 		computing_times: {
// 			loading: number;
// 			solving: number;
// 			routing: number;
// 		};
// 	};
// 	unassigned: any[];
// 	routes: Route[];
// };
