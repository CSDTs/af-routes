export interface Coordinates {
	latitude: number | string;
	longitude: number | string;
}
type TimeWindow = [string, string];
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
