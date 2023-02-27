import { Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import locationData from "../data/addresses.json";
import { Coordinates, Location } from "../types";
import LocationRow from "./LocationRow";
import Modal from "./Modal";
import ModalToolbar from "./ModalToolbar";
import TableFooter from "./form/TableFooter";

interface TableProps {
	currentLocations: Array<Location>;
	handleLocationsUpdate: (data: Array<Location>) => void;
}

export default function LocationTable({ currentLocations, handleLocationsUpdate }: TableProps) {
	const [isOpen, setIsOpen] = useState(false);
	const initData = {
		address: "",
		coordinates: null,
		drop_off: 0,
		is_high_priority: false,
		time_slots: [],
		available_options: [],
		raw_data: null,
	};

	const [rowsData, setRowsData] = useState<Array<Location>>(
		currentLocations.length > 0 ? currentLocations : [{ ...initData }]
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

	const handleCoordinateUpdate = (index: number, coordinates: Coordinates) => {
		const name = "coordinates";
		const value = coordinates;
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
		handleLocationsUpdate(rowsData);
	}, [rowsData]);

	const tableButtons = [
		{
			name: "+ Add New Destination",
			color: "green",
			callback: addTableRows,
		},
		,
		{
			name: "Finish",
			color: "blue",
			callback: closeModal,
		},
	];
	return (
		<>
			<div className="flex items-center justify-center mx-auto gap-3">
				<button
					type="button"
					onClick={openModal}
					className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
					{(rowsData && rowsData.length > 1 && "Edit") || "Fill"} Table
				</button>

				<button
					type="button"
					onClick={populateLocationsFromDatabase}
					className="rounded-md bg-indigo-50 text-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
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
													<LocationRow
														rowsData={rowsData}
														deleteTableRows={deleteTableRows}
														handleChange={handleChange}
														handleCoordinateUpdate={handleCoordinateUpdate}
														handleDataChange={handleDataChange}
													/>
												</tbody>
											</table>
										</div>
									</div>
									<div className="mt-4">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
											onClick={addTableRows}>
											+ Add New Destination
										</button>{" "}
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
