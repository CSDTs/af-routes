import axios from "axios";
import { FormEvent, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import PositionStackService from "../services/positionstack.service";
import { Coordinates, Driver, Location } from "../types";
import AddressAutoComplete from "./AddressAutocomplete";
import LoadingIndicator from "./base/LoadingIndicator";
import TableInput from "./base/TableInput";
import TableSelect from "./form/TableSelect";

interface LocationRowData extends Driver {
	available_options: Array<any>;
	raw_data: any;
}

interface RowProps {
	rowsData: Array<LocationRowData>;
	deleteTableRows: (index: number) => void;
	handleChange: (
		index: number,
		e: FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement> | Coordinates | null
	) => void;
	handleCoordinateUpdate: (index: number, coordinates: Coordinates | null) => void;
	handleDataChange: (idx: number, key: string, data: any) => void;
}

const DriverRow = ({ rowsData, deleteTableRows, handleChange, handleCoordinateUpdate, handleDataChange }: RowProps) => {
	const [count, setCount] = useState({ idx: -1, data: "" });

	const tableCellCSS = "p-4 pl-8 text-slate-50";
	const coordinateCallback = (data: Array<any>) => {
		handleCoordinateUpdate(
			count.idx,
			data.length > 0 ? { latitude: data[0].latitude, longitude: data[0].longitude } : { latitude: 0, longitude: 0 }
		);
		handleDataChange(count.idx, "available_options", data);
		handleDataChange(count.idx, "raw_data", data[0]);
	};
	//Wait for a second before calling API to get coordinates...
	useDebounce(() => PositionStackService.convertToCoordinates(count.data, coordinateCallback), 1000, [count]);

	return (
		<>
			{rowsData.map((data, idx) => {
				const {
					full_name,
					starting_address,
					coordinates,
					time_window,
					max_travel_time,
					max_stops,
					break_slots,
					available_options,
					raw_data,
				} = data;

				return (
					<tr key={idx}>
						<td className={`${tableCellCSS} w-2/6`}>
							<TableInput
								name={"full_name"}
								type="text"
								inputValue={full_name}
								placeholder="e.g. Dan Smith"
								handleChange={(e) => {
									handleChange(idx, e);
								}}></TableInput>
						</td>
						<td className={`${tableCellCSS} w-2/6`}>
							<TableInput
								name={"starting_address"}
								type="text"
								inputValue={starting_address}
								placeholder="e.g. 6559 Grand River Ave, Detroit, MI 48208"
								handleChange={(e) => {
									setCount({ idx: idx, data: (e.target as HTMLInputElement).value });
									handleChange(idx, e);
									handleDataChange(idx, "raw_data", null);
								}}>
								{" "}
								{count.data && starting_address != "" && <LoadingIndicator isLoading={!raw_data && count.data != ""} />}
								{raw_data && (
									<div className="flex  items-center gap-4 py-2 ">
										<p className="text-gray-800 text-xs">
											{raw_data?.label ?? raw_data?.region_code ?? ""} {raw_data?.postal_code ?? ""}
										</p>
										{/* <p className="text-gray-800 text-xs">
											latitude: {raw_data?.latitude} , longitude: {raw_data?.longitude}
										</p> */}
										<button
											className="text-white bg-gray-500 px-2 py-1 rounded-sm font-semi"
											onClick={() => handleDataChange(idx, "starting_address", raw_data?.label)}>
											Update address
										</button>
									</div>
								)}
							</TableInput>
						</td>

						<td className={`${tableCellCSS} w-1/6 `}>
							<TableInput
								name="time_window"
								type="number"
								inputValue={time_window}
								placeholder="e.g. 5"
								handleChange={(e) => handleChange(idx, e)}
							/>
						</td>

						<td className={`${tableCellCSS} w-1/12  `}>
							<TableInput
								name="max_travel_time"
								type="number"
								inputValue={max_travel_time}
								placeholder="e.g. 5"
								handleChange={(e) => handleChange(idx, e)}
							/>
						</td>

						<td className={`${tableCellCSS} w-1/12  `}>
							<TableInput
								name="max_stops"
								type="number"
								inputValue={max_stops}
								placeholder="e.g. 5"
								handleChange={(e) => handleChange(idx, e)}
							/>
						</td>

						<td className={`${tableCellCSS}  w-1/12 `}>
							<p className="text-gray-800">Coming Soon</p>
						</td>
						<td
							className={`${tableCellCSS} flex justify-center border-0   justify-self-center content-center self-center h-full`}>
							<button
								type="button"
								onClick={() => deleteTableRows(idx)}
								className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									className="w-4 h-4">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>

								<span className="sr-only">Icon description</span>
							</button>
						</td>
					</tr>
				);
			})}
		</>
	);
};

export default DriverRow;
