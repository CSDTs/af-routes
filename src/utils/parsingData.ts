import { Driver, Location } from "@/types";
import { uniqueId } from "lodash";
import * as Papa from "papaparse";
// address: row.address.replace(/\\,/g, ",") was used to replace all the commas in the address with a backslash

type PossibleData = Driver | Location;

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

export const parseCSVFile = (file: any, type: string, onComplete: (data: any) => void) => {
	Papa.parse(file, {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
		complete: (results) => {
			const parse = type === "driver" ? parseDriver : parseStop;
			const parsedData: PossibleData[] = results.data.map((row: any) => parse(row));

			if (type === "driver") onComplete(parsedData as Driver[]);
			else if (type === "stop") onComplete(parsedData as Location[]);
		},
	});
};
export const jsonToFile = (data: object, filename: string) => {
	const jsonData = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonData], { type: "application/json" });
	return new File([blob], filename, { type: "application/json" });
};
