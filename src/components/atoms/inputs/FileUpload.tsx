import { useRouteStore } from "@/store";
import { parseDriver, parseStop } from "@/utils/parsingData";
import { classNames } from "@/utils/styles";

import * as Papa from "papaparse";

import { FC, useMemo, useState } from "react";

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
		if (dataType === "stop") return parseStop;
		else return parseDriver;
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
				You don't have any {dataType}s yet. Upload a CSV to import them. Drag and drop or click{" "}
				<em className="font-semibold">Upload</em> above. Click{" "}
				<a href={csvFile} download className="text-blue-500 font-semibold">
					here
				</a>{" "}
				for an example.
			</p>
		</div>
	);
};

export default FileUpload;
