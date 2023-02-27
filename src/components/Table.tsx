import { Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import locationData from "../data/addresses.json";
import useDebounce from "../hooks/useDebounce";
import PositionStackService from "../services/positionstack.service";
import { Driver, Location } from "../types";
import LocationRow from "./LocationRow";
import Modal from "./Modal";
import ModalToolbar from "./ModalToolbar";
import TableInput from "./base/TableInput";
import TableFooter from "./form/TableFooter";
import TableSelect from "./form/TableSelect";
interface TableProps {
	data: Array<Location> | Array<Driver> | [];
	setData: (data: Location | Driver | {}) => void;
}

const addRowToTable = (initData: any, data: any, setData: (d: any) => void) => {
	const newRow = { ...initData };
	setData([...data, newRow]);
};
export default function Table({ data, setData }: TableProps) {
	const [isOpen, setIsOpen] = useState(false);
	const initData = {};
	const [rowsData, setRowsData] = useState<Array<Location> | Array<Driver> | Array<{}>>(
		data.length > 0 ? data : [{ ...initData }]
	);

	const closeModal = () => setIsOpen(false);
	const openModal = () => setIsOpen(true);

	const addTableRows = () => {
		const rowsInput = { ...initData };
		setRowsData([...rowsData, rowsInput]);
	};

	const deleteTableRows = (index: number) => {
		const rows = [...rowsData];
		rows.splice(index, 1);
		setRowsData(rows);
	};

	const handleChange = (index: number, event: Event) => {
		const { name, value } = event.target as HTMLButtonElement;
		const rowsInput = [...rowsData];
		rowsInput[index][name] = value;
		setRowsData(rowsInput);
	};

	const handleDataChange = (idx: number, key: string, data: any) => {
		const rowsInput = [...rowsData];
		rowsInput[idx][key] = data;
		setRowsData(rowsInput);
	};
	const populateLocationsFromDatabase = () => {
		setRowsData(locationData);
	};

	useEffect(() => {
		setData(rowsData);
	}, [rowsData]);

	const tableButtons = [
		{
			name: "Finish",
			color: "blue",
			callback: closeModal,
		},
	];
	const [count, setCount] = useState({ idx: -1, data: "" });

	const tableCellCSS = "p-4 pl-8 text-slate-50";
	const coordinateCallback = (data: Array<any>) => {
		handleDataChange(
			count.idx,
			"coordinates",
			data.length > 0 ? { latitude: data[0].latitude, longitude: data[0].longitude } : { latitude: 0, longitude: 0 }
		);
		handleDataChange(count.idx, "available_options", data);
		handleDataChange(count.idx, "raw_data", data[0]);
	};
	//Wait for a second before calling API to get coordinates...
	useDebounce(() => PositionStackService.convertToCoordinates(count.data, coordinateCallback), 1000, [count]);

	return (
		<>
			<div className="flex items-center justify-center mx-auto gap-3">
				<button
					type="button"
					onClick={openModal}
					className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
					{(data && data.length > 1 && "Edit") || "Fill"} Table
				</button>

				<button
					type="button"
					onClick={populateLocationsFromDatabase}
					className="rounded-md bg-indigo-50 text-indigo-500 px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
					Autofill
				</button>
			</div>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95">
								<Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Customer Locations
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Fill out the table below to start adding destinations to the map.
										</p>
									</div>
									<div className="relative rounded-xl overflow-auto">
										<div className="shadow-sm my-8">
											<table className="border-collapse table-auto w-full text-sm">
												<thead>
													<tr>
														<th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">
															Address
														</th>
														<th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">
															Drop Off Time
														</th>
														<th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">
															Priority
														</th>
														<th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">
															Time Slots
														</th>
														<th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">
															Delete
														</th>
													</tr>
												</thead>
												<tbody className="bg-white">
													<>
														{rowsData.map((data, idx) => {
															const {
																address,
																coordinates,
																drop_off,
																is_high_priority,
																time_slots,
																available_options,
																raw_data,
															} = data;

															return (
																<tr key={idx}>
																	<td className={`${tableCellCSS}`}>
																		<TableInput
																			name={"address"}
																			type="text"
																			inputValue={address}
																			placeholder="e.g. 6559 Grand River Ave, Detroit, MI 48208"
																			handleChange={(e) => {
																				setCount({ idx: idx, data: (e.target as HTMLInputElement).value });
																				handleChange(idx, e);
																				handleDataChange(idx, "raw_data", null);
																			}}>
																			{" "}
																			{count.data && <LoadingIndicator isLoading={!raw_data && count.data != ""} />}
																			{raw_data && (
																				<div className="flex  items-center gap-4 py-2 ">
																					<p className="text-gray-800 text-xs">
																						{raw_data?.label ?? raw_data?.region_code ?? ""}{" "}
																						{raw_data?.postal_code ?? ""}
																					</p>
																					{/* <p className="text-gray-800 text-xs">
											latitude: {raw_data?.latitude} , longitude: {raw_data?.longitude}
										</p> */}
																					<button
																						className="text-white bg-gray-500 px-2 py-1 rounded-sm font-semi"
																						onClick={() => handleDataChange(count.idx, "address", raw_data?.label)}>
																						Update address
																					</button>
																				</div>
																			)}
																		</TableInput>
																	</td>

																	<td className={`${tableCellCSS} w-1/6 `}>
																		<TableInput
																			name="DropOff"
																			type="number"
																			inputValue={drop_off}
																			placeholder="e.g. 5"
																			handleChange={(e) => handleChange(idx, e)}
																		/>
																	</td>

																	<td className={`${tableCellCSS}  w-1/6`}>
																		<TableSelect
																			name="Priority"
																			inputValue={is_high_priority}
																			options={["Normal", "High"]}
																			handleChange={(e) => handleChange(idx, e)}
																		/>
																	</td>

																	<td className={`${tableCellCSS}  w-1/6`}>
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
												</tbody>
											</table>
										</div>
									</div>

									<div className="mt-4 flex gap-2">
										<button
											type="button"
											className={`inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2`}
											onClick={addTableRows}>
											+ Add New Row
										</button>
										<button
											type="button"
											className={`inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
											onClick={closeModal}>
											Finish
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
