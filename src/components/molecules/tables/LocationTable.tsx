import { useState } from "react";
import locationData from "../../../data/addresses.json";
import { TableData } from "../../../types";

import { useModalWithData } from "../../../hooks/useModal";
import useTable from "../../../hooks/useTable";
import { useRouteStore } from "../../../store";

import { CloseBtn, Modal, PrimaryBtn, SecondaryBtn } from "../../atoms/";

import LoadingIndicator from "../../atoms/indicators/LoadingIndicator";
interface TableProps {
	dataKey: string;
}
const LocationTable = ({ dataKey }: TableProps) => {
	const { modalOpen, setModalState } = useModalWithData();
	const currentLocations = useRouteStore((state) => state[dataKey]);
	const setData = useRouteStore((state) => state.setData);
	const [current, setCurrent] = useState(0);
	const initData = { address: "", duration: 0, timeWindow: "", priority: "", coordinates: {} };
	console.log(currentLocations);
	const tableHook = useTable(currentLocations, [
		{ address: "", duration: 0, timeWindow: "", priority: "", coordinates: {} },
	]);

	const closeModal = () => {
		const filteredData = tableHook.data.filter((data) => {
			return data.address !== "";
		});
		if (filteredData) {
			setData(dataKey, filteredData);
		}
		setModalState(false);
	};

	return (
		<>
			<div className="flex items-center justify-center mx-auto gap-3">
				<PrimaryBtn clickHandler={() => setModalState(true)}>Update Table</PrimaryBtn>
				<SecondaryBtn clickHandler={() => setData(dataKey, locationData)}>Autofill</SecondaryBtn>
			</div>

			<Modal title="Job Locations" isActive={modalOpen} handleClose={closeModal}>
				<div className="mt-2">
					<p className="text-sm text-gray-500">Fill out the table below to start adding destinations to the map.</p>
				</div>
				<div className="relative rounded-xl overflow-auto">
					<div className="shadow-sm my-8">
						<div className="overflow-x-auto min-h-[24rem]">
							<table className="table-auto w-full">
								<thead>
									<tr>
										<th className="px-4 py-2">Address</th>
										<th className="px-4 py-2">Duration</th>
										<th className="px-4 py-2">Time Window</th>
										<th className="px-4 py-2">Priority</th>
										<th className="px-4 py-2 invisible">Remove</th>
									</tr>
								</thead>
								<tbody>
									{tableHook.data.map((row, index) => (
										<tr key={index}>
											<td className="border px-4 py-2">
												<div className="relative">
													<div className="flex flex-col gap-2">
														<input
															type="text"
															className="w-full"
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
															<div className="absolute top-full left-0 w-full bg-white border border-gray-300 z-10">
																{tableHook.addresses.map((address, i) => (
																	<div
																		key={i}
																		className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
																		onClick={() => tableHook.handleSelect(address, index)}>
																		{address.displayName}
																	</div>
																))}
															</div>
														)}
													</div>
												</div>
											</td>
											<td className="border px-4 py-2">
												<input
													type="number"
													className="w-full"
													value={row.duration}
													onChange={(event) => tableHook.handleChange(event, index, "duration")}
													onFocus={() => setCurrent(index)}
												/>
											</td>
											<td className="border px-4 py-2">
												<input
													type="text"
													className="w-full"
													value={row.timeWindow}
													onChange={(event) => tableHook.handleChange(event, index, "timeWindow")}
													onFocus={() => setCurrent(index)}
												/>
											</td>
											<td className="border px-4 py-2">
												<input
													type="text"
													className="w-full"
													value={row.priority}
													onChange={(event) => tableHook.handleChange(event, index, "priority")}
													onFocus={() => setCurrent(index)}
												/>
											</td>
											<td className="border px-4 py-2">
												<button
													className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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
								className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded my-2"
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
