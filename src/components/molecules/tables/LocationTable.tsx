import { useEffect, useState } from "react";

import DateTimePicker from "react-datetime-picker";
import locationData from "../../../data/addresses.json";
import { TableData } from "../../../types";

import { useModalWithData } from "../../../hooks/useModal";
import useTable from "../../../hooks/useTable";
import { useRouteStore } from "../../../store";
import { convertToEpoch, convertToISO, newEpochDate, newISODate } from "../../../utils/convertDate";
import { CloseBtn, Modal, PrimaryBtn, SecondaryBtn } from "../../atoms/";
import LoadingIndicator from "../../atoms/indicators/LoadingIndicator";
interface TableProps {
	dataKey: string;
}
const LocationTable = ({ dataKey }: TableProps) => {
	const { modalOpen, setModalState } = useModalWithData();
	const currentLocations = useRouteStore((state) => state[dataKey]);
	const setData = useRouteStore((state) => state.setData);
	const newDate = newISODate();
	const [current, setCurrent] = useState(0);
	const initData = {
		address: "",
		drop_off_duration: 0,
		time_windows: [["00:00", "00:00"]],
		priority: "",
		coordinates: {},
		timeWindowStart: "",
		timeWindowEnd: "",
	};

	const tableHook = useTable(currentLocations, [initData]);
	const [value, onChange] = useState(new Date());
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
		tableHook.setData(locationData);
		setData(dataKey, locationData);
	};

	return (
		<>
			<div className="flex items-center justify-center gap-3 mx-auto">
				<PrimaryBtn clickHandler={() => setModalState(true)}>Update Table</PrimaryBtn>
				<SecondaryBtn clickHandler={populateFromDatabase}>Autofill</SecondaryBtn>
			</div>

			<Modal title="Job Locations" isActive={modalOpen} handleClose={closeModal}>
				<div className="mt-2">
					<p className="text-sm text-gray-500">Fill out the table below to start adding destinations to the map.</p>
				</div>
				<div className="relative overflow-auto rounded-xl">
					<div className="my-8 shadow-sm">
						<div className="overflow-x-auto min-h-[24rem]">
							<table className="w-full table-auto">
								<thead>
									<tr>
										<th className="px-4 py-2">Address</th>
										<th className="px-4 py-2">Duration</th>
										<th className="px-4 py-2">Time Window</th>
										<th className="px-4 py-2">Priority</th>
										<th className="invisible px-4 py-2">Remove</th>
									</tr>
								</thead>
								<tbody>
									{tableHook.data.map((row, index) => (
										<tr key={index} className="odd:bg-slate-50 even:bg-slate-200">
											<td className="w-5/12 px-4 py-2 border">
												<div className="relative">
													<div className="flex flex-col gap-2">
														<input
															type="text"
															className="items-center hidden w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
															value={row.address}
															onChange={(event) => tableHook.handleChange(event, index, "address")}
															onFocus={() => setCurrent(index)}
														/>

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
											</td>
											<td className="px-4 py-2 border">
												<input
													type="number"
													value={row.drop_off_duration}
													onChange={(event) => tableHook.handleChange(event, index, "duration")}
													onFocus={() => setCurrent(index)}
													className="w-full"
												/>
											</td>
											<td className="px-4 py-2 border">
												{/* <input
													type="text"
													className="w-full"
													value={row.timeWindow}
													onChange={(event) => tableHook.handleChange(event, index, "timeWindow")}
													onFocus={() => setCurrent(index)}
												/> */}
												<div className="flex flex-col">
													<label className="block">
														<span className="block text-sm font-medium text-slate-700">Start</span>
														<input
															type="time"
															value={row.time_windows[0][0]}
															onChange={(event) => tableHook.handleChange(event, index, "timeWindowStart")}
														/>
													</label>{" "}
													<label className="block">
														<span className="block text-sm font-medium text-slate-700">End</span>
														<input
															type="time"
															value={row.time_windows[0][1]}
															onChange={(event) => tableHook.handleChange(event, index, "timeWindowEnd")}
														/>
													</label>
												</div>
											</td>
											<td className="px-4 py-2 border">
												<input
													type="number"
													className="w-full"
													value={row.priority}
													onChange={(event) => tableHook.handleChange(event, index, "priority")}
													onFocus={() => setCurrent(index)}
												/>
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
export default LocationTable;
