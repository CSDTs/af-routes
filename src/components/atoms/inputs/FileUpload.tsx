import { useRouteStore } from "@/store";
import { classNames } from "@/utils/styles";
import { uniqueId } from "lodash";
import * as Papa from "papaparse";
import { parse } from "path";
import React, { FC, useCallback, useMemo, useState } from "react";
import Dropzone, { DropzoneOptions, useDropzone } from "react-dropzone";
interface IProps {
	dataType: "stop" | "driver";
}
/**
 * File upload component for data uploads, alerting users of the file upload process (using CSV) to add stops and drivers to the route.
 */
const FileUpload: FC<IProps> = ({ dataType }) => {
	const [dragActive, setDragActive] = useState<boolean>(false);
	const setData = useRouteStore((state) => state.setData);

	const createParsedEntry = useMemo(() => {
		if (dataType === "stop")
			return (data: any) => ({
				id: parseInt(uniqueId()),
				customer_name: data?.customer_name,
				// address: data.address.replace(/\\,/g, ","),
				address: data.address,
				drop_off_duration: data.drop_off_duration,
				time_windows: data.time_windows.split(",").map((tw: string) => {
					const [startTime, endTime] = tw.split("-");
					return { startTime, endTime };
				}),
				priority: data.priority,
				coordinates: { latitude: data.latitude, longitude: data.longitude },
			});
		else
			return (data: any) => ({
				id: parseInt(uniqueId()),
				// address: row.address.replace(/\\,/g, ","),
				address: data.address,
				name: data.name,
				max_travel_time: data.max_travel_time,
				time_window: { startTime: data.time_window.split("-")[0], endTime: data.time_window.split("-")[1] },
				max_stops: data.max_stops,
				// break_slots: [
				// 	{
				// 		id: parseInt(uniqueId()),
				// 		time_windows: [[data.break_slot_start, data.break_slot_end]],
				// 		service: data.service,
				// 	},
				// ],
				break_slots: data.break_slots.split(";").map((bs: string) => {
					const [time, service] = bs.split("(");
					const window = time.split(",").map((tw: string) => {
						const [startTime, endTime] = tw.split("-");
						return { startTime, endTime };
					});

					console.log(window);
					const breakLength = service.split(")")[0];
					return {
						id: parseInt(uniqueId()),
						time_windows: window,
						service: breakLength,
					};
				}),
				coordinates: { latitude: data.latitude, longitude: data.longitude },
			});
	}, [dataType]);

	const csvFile = useMemo(() => {
		return dataType === "stop" ? "/stops.csv" : "/drivers.csv";
	}, [dataType]);

	const onDragOver = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const onDrop = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		try {
			const file = Array.from(e.dataTransfer.files).filter((file: any) => file.type === "text/csv")[0] as File;

			Papa.parse(file, {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true,
				complete: (results) => {
					const parsedData = results.data.map((row: any) => createParsedEntry(row) as any);

					console.log(parsedData);
					setData(dataType === "stop" ? "locations" : "drivers", parsedData);
				},
			});
		} catch (e) {
			console.error("There was an error uploading your CSV file.");
		}
	};

	const onDragEnter = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const onDragLeave = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};

	return (
		<div
			className={classNames(
				dragActive ? "border-blue-500" : "",
				" py-5 text-center border-4  bg-slate-100 border-slate-300 h-1/2  items-center flex flex-col justify-center border-dashed"
			)}
			onDragOver={onDragOver}
			onDrop={onDrop}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-16 h-16 text-slate-500">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
				/>
			</svg>

			<h3 className="font-bold text-2xl mt-2 text-slate-700 capitalize">Upload {dataType}s</h3>
			<p className="mx-auto  p-3 text-slate-600">
				You don't have any {dataType}s yet. Upload a CSV to import them. Click{" "}
				<a href={csvFile} download className="text-blue-500 font-semibold">
					here
				</a>{" "}
				for an example. You can also add a {dataType} with quick values above.{" "}
			</p>
		</div>
	);
};

export default FileUpload;
