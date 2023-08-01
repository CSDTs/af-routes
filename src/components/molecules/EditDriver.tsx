import { useRouteStore } from "@/store";
import { fetchAddressData } from "@/utils/geocodeAddress";

import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { ChangeEvent, FC, FormEvent, Fragment, createRef, useEffect, useState } from "react";

import TimeWindowInput from "./TimeWindowInput";

import { Break, Driver, Location, TimeWindow } from "@/types";

import { convertTime } from "@/utils/timeHandlers";
import { uniqueId } from "lodash";
import AutocompleteAddressInput from "../AutoComplete";
import { Hint } from "../atoms";

interface IProps {
	open: boolean;
	stop: Driver;
	setOpen: (open: boolean) => void;
}
const EditDriver: FC<IProps> = ({ open, setOpen, stop }) => {
	const tableData = createRef<HTMLFormElement>();
	const updateDriver = useRouteStore((state) => state.updateDriver);

	const [initData, setInitData] = useState<Driver>(stop);

	const saveRoute = async () => {
		await fetchAddressData(initData.address)
			.then((data) => {
				// TODO: Rework this to check against geocoding data to verify every address is valid. Currently assuming that any autofill is valid, any selected address is valid.
				if (initData?.coordinates?.latitude === 0 && initData?.coordinates?.longitude === 0) {
					throw new Error("Coordinates are invalid. Please try again.");
				}

				updateDriver(stop.id, initData);
				setOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleAddTimeWindow = (timeWindow: TimeWindow, service?: number) => {
		//Typescript is complaining about service being undefined, but it's not
		if (!service) return;
		// First, find an existing slot with the same service time
		const existingSlot = initData.break_slots.find((slot) => slot.service === service);

		if (existingSlot) {
			// If there is an existing slot, add the new time window to it
			existingSlot.time_windows.push(timeWindow);
		} else {
			// If there isn't an existing slot, create a new one
			const newSlot: Break = {
				id: parseInt(uniqueId()),
				time_windows: [timeWindow],
				service: service,
			};
			initData.break_slots.push(newSlot);
		}

		// Update the initData state to trigger a re-render
		setInitData({ ...initData });
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

	const setAddress = (data: Partial<Location>) => {
		setInitData({ ...initData, ...data });
	};

	const removeBreakTimeWindow = (slot: Break, timeWindowId: number) => {
		const everyBreakButThisOne = initData.break_slots.filter((breakSlot) => breakSlot.id !== slot.id);

		const breakSlice = {
			...slot,
			time_windows: slot.time_windows.filter((_, i) => i !== timeWindowId),
		};

		const isBreakSliceEmpty = breakSlice.time_windows.length === 0;

		const slots = isBreakSliceEmpty ? [...everyBreakButThisOne] : [...everyBreakButThisOne, breakSlice];
		setInitData({
			...initData,
			break_slots: slots,
		});
	};
	useEffect(() => {
		if (stop) setInitData(stop);
	}, [open]);

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
														<AutocompleteAddressInput
															setData={setAddress}
															editValue={{
																display_name: initData.address,
																lat: initData?.coordinates?.latitude as number,
																lon: initData?.coordinates?.longitude as number,
																place_id: 0,
															}}
														/>
													</div>
													<div className="flex gap-4 p-2">
														<label>
															<Hint
																label="Max Travel Time"
																description="How long (roughly in minutes) should the driver take for any given stop?"
															/>
															<input
																name="max_travel_time"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.max_travel_time}
																onChange={updateData}
																aria-label="Max Travel Time"
															/>
														</label>
														<label>
															<Hint label="Max Stops" description="How many stops can the driver make?" />
															<input
																name="max_stops"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.max_stops}
																onChange={updateData}
																aria-label="Max Stops"
															/>
														</label>
													</div>

													<div className="flex p-2 flex-col">
														<Hint
															label="Time Window"
															description="How long is their shift? What is the time window in which they can deliver the order?"
														/>

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
														<Hint label="Break Slots" description="When can the driver take a break?" />
														<TimeWindowInput onAddTimeWindow={handleAddTimeWindow} enableService />
														<div className="w-full mt-4">
															{initData?.break_slots?.map((slot, index) => (
																<div key={index} className="flex gap-4 items-center py-0.5 ">
																	<span>{slot.service} min: </span>

																	{slot.time_windows.map((tw, idx) => (
																		<span className="flex items-center gap-2 flex-wrap">
																			<span key={idx}>
																				{convertTime(tw.startTime)} to {convertTime(tw.endTime)}
																			</span>
																			<TrashIcon
																				className="h-4 w-4"
																				onClick={() => {
																					removeBreakTimeWindow(slot, idx);
																				}}
																			/>{" "}
																			{idx !== slot.time_windows.length - 1 && <>&#44; </>}
																		</span>
																	))}
																</div>
															))}
														</div>
													</div>
												</section>
												<div className="mt-auto w-full flex py-4">
													<button
														type="button"
														onClick={() => setOpen(false)}
														className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
														Cancel
													</button>
													<button
														type="submit"
														className="ml-auto px-3 py-2  font-semibold text-white bg-slate-500 rounded hover:bg-slate-700 disabled:bg-slate-500/30 disabled:cursor-not-allowed text-sm"
														disabled={initData?.coordinates?.latitude === 0 && initData?.coordinates?.longitude === 0}>
														Save and Close
													</button>
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
