import { useRouteStore } from "@/store";
import { fetchAddressData } from "@/utils/geocodeAddress";
import getFormValues from "@/utils/getFormValues";
import { Dialog, Transition } from "@headlessui/react";
import { QuestionMarkCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { ChangeEvent, FC, FormEvent, Fragment, createRef, useEffect, useState } from "react";

import TimeWindowInput from "./TimeWindowInput";

import { Driver, Location, TimeWindow } from "@/types";

import { uniqueId } from "lodash";
import AutocompleteAddressInput from "../AutoComplete";

interface IProps {
	open: boolean;
	stop: Driver;
	setOpen: (open: boolean) => void;
}
const EditDriver: FC<IProps> = ({ open, setOpen, stop }) => {
	const tableData = createRef<HTMLFormElement>();
	const locations = useRouteStore((state) => state.locations);
	const updateLocation = useRouteStore((state) => state.updateLocation);

	const [addresses, setAddresses] = useState([]);

	const [initData, setInitData] = useState<Driver>(stop);

	const saveRoute = async () => {
		const formData = getFormValues(tableData);

		console.log(initData);

		if (formData.address == "") return;

		await fetchAddressData(formData.address).then((data) => {
			if (data.length > 1 || (initData?.coordinates?.latitude == 0 && initData?.coordinates?.longitude == 0)) {
				console.log(data);
				setAddresses(data);
			}
		});

		if (initData?.coordinates?.latitude == 0 && initData?.coordinates?.longitude == 0) {
			console.log("address not found");
			return;
		}

		const isAddressADuplicate = locations.some((location) => location.address === initData.address);

		if (isAddressADuplicate) {
			console.log("address is a duplicate");
			return;
		}

		updateLocation(stop.id, initData);
		setOpen(false);
	};

	const [timeWindows, setTimeWindows] = useState<TimeWindow[]>([]);

	const handleAddTimeWindow = (timeWindow: TimeWindow) => {
		setTimeWindows([...timeWindows, timeWindow]);
	};

	const updateData = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value !== "") {
			setInitData({
				...initData,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		saveRoute();
	};
	const createBreak = (window: TimeWindow) => {
		return {
			id: parseInt(uniqueId()),
			time_windows: [{ startTime: window.startTime, endTime: window.endTime }],
			service: 0,
		};
	};
	useEffect(() => {
		const breaks = timeWindows.map((tw) => createBreak(tw));
		if (timeWindows.length > 0) {
			setInitData({ ...initData, break_slots: breaks });
		}
	}, [timeWindows]);

	useEffect(() => {
		console.log(stop);
		if (stop.break_slots) {
			const slots = stop.break_slots.map((slot) => {
				return { startTime: slot.time_windows[0].startTime, endTime: slot.time_windows[0].endTime };
			});
			setTimeWindows(slots);
		}
	}, [stop]);
	const setAddress = (data: Partial<Location>) => {
		setInitData({ ...initData, ...data });
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-in-out duration-500"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in-out duration-500"
					leaveFrom="opacity-100"
					leaveTo="opacity-0">
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full">
								<Dialog.Panel className="pointer-events-auto relative w-screen max-w-xl">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-500"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-500"
										leaveFrom="opacity-100"
										leaveTo="opacity-0">
										<div className="absolute right-0 top-0 -mr-8 flex pr-2 pt-4 sm:-mr-0 sm:pr-4">
											<button
												type="button"
												className="relative rounded-md text-slate-600 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
												onClick={() => setOpen(false)}>
												<span className="absolute -inset-2.5" />
												<span className="sr-only">Close panel</span>
												<XMarkIcon className="h-6 w-6" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									<div className="flex h-full flex-col bg-white py-6 shadow-xl">
										<div className="px-4 sm:px-6">
											<Dialog.Title className="text-3xl font-semibold leading-6 text-gray-900">
												Edit Driver
											</Dialog.Title>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{" "}
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													Fill out the table below to start adding destinations to the map.
												</p>
											</div>
											<form ref={tableData} onSubmit={handleSubmit} className="h-full flex flex-col">
												<section>
													<div className="flex flex-row  p-2 gap-4">
														<label className="w-3/5">
															<span>Driver's Name</span>
															<input
																type="text"
																name="name"
																placeholder="e.g. Jen Smith"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex  ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.name}
																onChange={updateData}
															/>
														</label>{" "}
													</div>
													<div className="flex flex-row  p-2 gap-4">
														{initData.address && (
															<AutocompleteAddressInput
																setData={setAddress}
																editValue={{
																	display_name: initData.address,
																	lat: initData?.coordinates?.latitude as number,
																	lon: initData?.coordinates?.longitude as number,
																	place_id: 0,
																}}
															/>
														)}
													</div>
													<div className="flex gap-4 p-2">
														<label className=" ">
															<span className="flex justify-between">
																Max Travel Time{" "}
																<span className="group relative w-max">
																	<QuestionMarkCircleIcon className="text-slate-400 w-6 h-6" />
																	<span className="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-200 text-slate-500 max-w-md rounded-md p-2 shadow-md">
																		How long (roughly in minutes) should the driver take for any given stop?
																	</span>
																</span>
															</span>
															<input
																name="max_travel_time"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.max_travel_time}
																onChange={updateData}
															/>
														</label>
														<label className="">
															<span className="flex justify-between">
																Max Stops{" "}
																<span className="group relative w-max">
																	<QuestionMarkCircleIcon className="text-slate-400 w-6 h-6" />
																	<span className="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-200 text-slate-500 max-w-md rounded-md p-2 shadow-md">
																		How many stops can the driver make?
																	</span>
																</span>
															</span>
															<input
																name="max_stops"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.max_stops}
																onChange={updateData}
															/>
														</label>
													</div>

													<div className="flex p-2 flex-col">
														<span>Time Window</span>

														<div className="flex items-center gap-4">
															<label>
																<span className="sr-only">Start Time</span>
																<input
																	type="time"
																	value={initData?.time_window.startTime}
																	onChange={(e) =>
																		setInitData({
																			...initData,
																			time_window: { ...initData.time_window, startTime: e.target.value },
																		})
																	}
																	className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																/>
															</label>

															<span> to </span>
															<label htmlFor="">
																<span className="sr-only">End Time</span>
																<input
																	type="time"
																	value={initData?.time_window.endTime}
																	onChange={(e) =>
																		setInitData({
																			...initData,
																			time_window: { ...initData.time_window, endTime: e.target.value },
																		})
																	}
																	className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																/>
															</label>
														</div>
													</div>
													<div className="flex p-2 flex-col ">
														<span>Break Slots</span>

														<TimeWindowInput onAddTimeWindow={handleAddTimeWindow} />

														<div className="w-1/2 mt-4">
															{timeWindows.map((tw, index) => (
																<div key={index} className="flex gap-4 items-center py-0.5 ">
																	<span>
																		{tw.startTime} to {tw.endTime}
																	</span>{" "}
																	<TrashIcon className="h-4 w-4" />
																</div>
															))}
														</div>
													</div>
												</section>
												<div className="mt-auto w-full flex py-4">
													{" "}
													{/* <button
														className="px-2 py-1 my-2 font-bold text-white bg-indigo-500 rounded hover:bg-indigo-700"
														onClick={saveRoute}>
														Save and Add Another
													</button> */}
													<button
														onClick={() => setOpen(false)}
														className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
														{" "}
														Cancel
													</button>{" "}
													<button
														type="submit"
														className="ml-auto px-3 py-2  font-semibold text-white bg-slate-500 rounded hover:bg-slate-700 disabled:bg-slate-500/30 disabled:cursor-not-allowed text-sm"
														disabled={initData?.coordinates?.latitude === 0 && initData?.coordinates?.longitude === 0}>
														Save and Close
													</button>{" "}
												</div>
											</form>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};
export default EditDriver;
