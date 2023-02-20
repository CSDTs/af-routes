import { Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import locationData from "../data/addresses.json";
import { Location } from "../types";
import LocationRow from "./LocationRow";
interface TableProps {
	children: React.ReactNode;
}

export default function LocationTable({ children }: TableProps) {
	const [isOpen, setIsOpen] = useState(false);

	const [rowsData, setRowsData] = useState<Array<Location>>(
		currentLocations || [
			{
				address: "",
				coordinates: {},
				drop_off: 0,
				is_high_priority: "normal",
				time_slots: [],
			},
		]
	);

	const closeModal = () => setIsOpen(false);
	const openModal = () => setIsOpen(true);

	const addTableRows = () => {
		const rowsInput = {
			address: "",
			coordinates: {},
			drop_off: 0,
			is_high_priority: "normal",
			time_slots: [],
		};
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

	const handleCoordinateUpdate = (index, coordinates) => {
		const name = "coordinates";
		const value = coordinates;
		const rowsInput = [...rowsData];
		rowsInput[index][name] = value;
		setRowsData(rowsInput);
	};

	const populateLocationsFromDatabase = () => {
		setRowsData(locationData);
	};
	useEffect(() => {
		handleLocationsUpdate(rowsData);
	}, [rowsData]);
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
													/>
												</tbody>
											</table>
										</div>
										<button className=" bg-green-400 text-white p-4 mt-4 rounded-sm" onClick={addTableRows}>
											+ Add New Destination
										</button>
									</div>

									<div className="mt-4">
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
