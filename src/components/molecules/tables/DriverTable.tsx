import { useState } from "react";
import driverData from "../../../data/drivers.json";

import { useModalWithData } from "../../../hooks/useModal";
import useTable from "../../../hooks/useTable";
import { useRouteStore } from "../../../store";

import { uniqueId } from "lodash";
import * as Papa from "papaparse";
import { CloseBtn, LoadingIndicator, Modal, PrimaryBtn, SecondaryBtn } from "../../atoms/";

interface TableProps {
	dataKey: string;
}

const DriverTable = ({ dataKey }: TableProps) => {
	const { modalOpen, setModalState } = useModalWithData();
	const currentDrivers = useRouteStore((state) => state[dataKey]);
	const setData = useRouteStore((state) => state.setData);
	const [current, setCurrent] = useState(0);
	const initData = {
		address: "",
		name: "",
		max_travel_time: 0,
		time_window: ["00:00", "00:00"],
		max_stops: 0,
		break_slots: [
			{
				time_windows: [["00:00", "00:00"]],
				service: 0,
			},
		],
		coordinates: {},
	};

	const tableHook = useTable(currentDrivers, [initData]);

	const closeModal = () => {
		const filteredData = tableHook.data.filter((data) => {
			return data.address !== "";
		});
		if (filteredData) {
			setData(dataKey, filteredData);
		}
		setModalState(false);
	};
	const populateFromDatabase = () => {
		const temp = driverData.map((driver) => {
			return { id: parseInt(uniqueId()), ...driver };
		});
		tableHook.setData(temp);
		setData(dataKey, temp);
	};
	const handleCSVUpload = (event: any) => {
		const file = event.target.files[0];
		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: (results) => {
				// Transform the data into the expected format
				const parsedData = results.data.map((row: any, index) => ({
					id: parseInt(uniqueId()),
					address: row.address.replace(/\\,/g, ","),
					name: row.name,
					max_travel_time: row.max_travel_time,
					time_window: [row.time_window_start, row.time_window_end],
					max_stops: row.max_stops,
					break_slots: [
						{
							time_windows: [[row.break_slot_start, row.break_slot_end]],
							service: row.service,
						},
					],
					coordinates: { latitude: row.latitude, longitude: row.longitude },
				}));

				// Update the table and store with the parsed data
				tableHook.setData(parsedData);
				setData(dataKey, parsedData);
			},
		});
	};

	return (
		<>
			<div className="flex items-center justify-center gap-4 mx-auto">
				<PrimaryBtn clickHandler={() => setModalState(true)}>Update Table</PrimaryBtn>
				<SecondaryBtn clickHandler={populateFromDatabase}>Autofill</SecondaryBtn>
				<label className="cursor-pointer flex w-full text-center">
					<span className="rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full cursor-pointer">
						Upload CSV
					</span>
					<input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
				</label>
			</div>

			<Modal title="Drivers" isActive={modalOpen} handleClose={closeModal}>
				<div className="mt-2">
					<p className="text-sm text-gray-500">Fill out the table below to start adding drivers to the map.</p>
				</div>
				<div className="relative overflow-auto rounded-xl">
					<div className="my-8 shadow-sm">
						<div className="overflow-x-auto min-h-[24rem]">
							<table className="w-full table-auto">
								<thead>
									<tr>
										<th className="px-4 py-2">Starting Location</th>
										<th className="px-4 py-2">Driver Name</th>
										<th className="px-4 py-2">Max Travel Time</th>
										<th className="px-4 py-2">Time Window</th>
										<th className="px-4 py-2">Max Stops</th>
										<th className="px-4 py-2">Breaks</th>
										<th className="invisible px-4 py-2">Remove</th>
									</tr>
								</thead>
								<tbody>
									{tableHook.data.map((row, index) => (
										<tr key={index} className="odd:bg-slate-50 even:bg-slate-200">
											<td className="px-4 py-2 border">
												<div className="relative">
													<div className="flex flex-col gap-2">
														<label className="block">
															<span className="sr-only">Starting Address</span>
															<input
																type="text"
																placeholder="e.g. 23600 Heidelberg St, Detroit, MI 48207, United States"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																value={row.address}
																onChange={(event) => tableHook.handleChange(event, index, "address")}
																onFocus={() => setCurrent(index)}
															/>
														</label>

														{current == index && tableHook.loading && (
															<div className="absolute top-0 right-0 mt-2 mr-2">
																<LoadingIndicator isLoading={tableHook.loading} />
															</div>
														)}
														{current == index && tableHook.addresses.length > 0 && (
															<div className="absolute left-0 z-10 w-full bg-white border border-gray-300 top-full">
																{tableHook.addresses.map((address, i) => (
																	<div
																		key={i}
																		className="px-4 py-2 cursor-pointer hover:bg-gray-200"
																		onClick={() => tableHook.handleSelect(address, index)}>
																		{address.displayName}
																	</div>
																))}
															</div>
														)}
													</div>
												</div>
											</td>{" "}
											<td className="px-4 py-2 border">
												<label className="block">
													<span className="sr-only">Driver Name</span>
													<input
														type="text"
														placeholder="e.g. Taylor Jones"
														className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
														value={row.name}
														onChange={(event) => tableHook.handleChange(event, index, "name")}
														onFocus={() => setCurrent(index)}
													/>{" "}
												</label>
											</td>
											<td className="w-1/12 px-4 py-2 border">
												<label className="block">
													<span className="sr-only">Max Travel Time</span>
													<input
														type="number"
														className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
														value={row.max_travel_time}
														onChange={(event) => tableHook.handleChange(event, index, "max_travel_time")}
														onFocus={() => setCurrent(index)}
													/>
												</label>
											</td>
											<td className="px-4 py-2 border">
												<div className="flex flex-col">
													<label className="block">
														<span className="block text-sm font-medium text-slate-700">Start</span>
														<input
															type="time"
															value={row.time_window[0]}
															className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
															onChange={(event) => tableHook.handleChange(event, index, "timeWindowStart")}
														/>
													</label>{" "}
													<label className="block">
														<span className="block text-sm font-medium text-slate-700">End</span>
														<input
															type="time"
															value={row.time_window[1]}
															className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
															onChange={(event) => tableHook.handleChange(event, index, "timeWindowEnd")}
														/>
													</label>
												</div>
											</td>
											<td className="w-1/12 px-4 py-2 border">
												<label className="block">
													<span className="sr-only">Max Stops</span>
													<input
														type="number"
														className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
														value={row.max_stops}
														onChange={(event) => tableHook.handleChange(event, index, "max_stops")}
														onFocus={() => setCurrent(index)}
													/>
												</label>
											</td>{" "}
											<td className="px-4 py-2 border">
												<div className="flex flex-col">
													<label className="block">
														<span className="block text-sm font-medium text-slate-700">Start</span>
														<input
															type="time"
															value={row.break_slots[0].time_windows[0][0]}
															className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
															onChange={(event) => tableHook.handleChange(event, index, "breakSlotStart")}
															onFocus={() => setCurrent(index)}
														/>
													</label>{" "}
													<label className="block">
														<span className="block text-sm font-medium text-slate-700">End</span>
														<input
															type="time"
															value={row.break_slots[0].time_windows[0][1]}
															className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
															onChange={(event) => tableHook.handleChange(event, index, "breakSlotEnd")}
															onFocus={() => setCurrent(index)}
														/>
													</label>
												</div>
											</td>
											<td className="px-4 py-2 border">
												<button
													className="px-2 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-700"
													onClick={() => tableHook.removeRow(index)}
													onFocus={() => setCurrent(index)}>
													Remove
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<button
								className="px-2 py-1 my-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
								onClick={() => tableHook.addRow(initData)}>
								Add Row
							</button>
						</div>
					</div>
				</div>
				<div className="mt-4">
					<CloseBtn clickHandler={closeModal}>Accept and Close</CloseBtn>
				</div>
			</Modal>
		</>
	);
};
export default DriverTable;
