export interface Coordinates {
	latitude: number | string;
	longitude: number | string;
}

export interface Driver {
	full_name: string;
	starting_address: string;
	coordinates: Coordinates | null;
	time_window: string;
	max_travel_time: number;
	max_stops: number;
	break_slots: Array<unknown> | null;
}

export interface Location {
	address: string;
	coordinates: Coordinates | null;
	drop_off: number;
	is_high_priority: boolean;
	time_slots: Array<unknown> | null;
}
