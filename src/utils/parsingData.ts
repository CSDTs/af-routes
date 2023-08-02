import { uniqueId } from "lodash";

// address: row.address.replace(/\\,/g, ",") was used to replace all the commas in the address with a backslash

export const parseDriver = (data: any) => ({
	id: parseInt(uniqueId()),
	address: data.address,
	name: data.name,
	max_travel_time: data.max_travel_time,
	time_window: { startTime: data.time_window.split("-")[0], endTime: data.time_window.split("-")[1] },
	max_stops: data.max_stops,

	break_slots: data.break_slots.split(";").map((bs: string) => {
		const [time, service] = bs.split("(");
		const window = time.split(",").map((tw: string) => {
			const [startTime, endTime] = tw.split("-");
			return { startTime, endTime };
		});
		const breakLength = service.split(")")[0];
		return {
			id: parseInt(uniqueId()),
			time_windows: window,
			service: breakLength,
		};
	}),
	coordinates: { latitude: data.latitude, longitude: data.longitude },
});

export const parseStop = (data: any) => ({
	id: parseInt(uniqueId()),
	customer_name: data?.customer_name,
	address: data.address,
	drop_off_duration: data.drop_off_duration,
	time_windows: data.time_windows.split(",").map((tw: string) => {
		const [startTime, endTime] = tw.split("-");
		return { startTime, endTime };
	}),
	priority: data.priority,
	coordinates: { latitude: data.latitude, longitude: data.longitude },
});
