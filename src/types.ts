export interface Coordinates {
	latitude: number | string;
	longitude: number | string;
}

export interface Driver {
	name: string;
	address: string;
	coordinates: Coordinates | null;
	time_window: string;
	max_travel_time: number;
	max_stops: number;
	break_slots: string;
	raw_data?: any;
	available_options?: any;
}

export interface Location {
	address: string;
	coordinates?: Coordinates | null;
	drop_off: number;
	is_high_priority: boolean;
	time_slots: string;
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
