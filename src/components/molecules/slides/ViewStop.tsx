import { AutocompleteAddressInput, Hint, TimeWindowInput } from "@/components/atoms";
import { useRouteStore } from "@/store";
import { fetchAddressData } from "@/utils/geocodeAddress";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { ChangeEvent, FC, FormEvent, Fragment, createRef, useEffect, useState } from "react";

import { Location, TimeWindow } from "@/types";
import { convertTime } from "@/utils/timeHandlers";

interface IProps {
	open: boolean;
	stop: Location;
	setOpen: (open: boolean) => void;
}
const ViewStop: FC<IProps> = ({ open, setOpen, stop }) => {
	const tableData = createRef<HTMLFormElement>();
	const locations = useRouteStore((state) => state.locations);
	const updateLocation = useRouteStore((state) => state.updateLocation);

	const [initData, setInitData] = useState<Location>(stop);

	const saveRoute = async () => {
		await fetchAddressData(initData.address)
			.then((data) => {
				// TODO:Add feedback for duplicate addresses so user knows what to
				const duplicate = locations.find((loc) => loc.address === initData.address);
				if (duplicate) {
					throw new Error("Address is a duplicate. Please try again.");
				}

				// TODO: Rework this to check against geocoding data to verify every address is valid. Currently assuming that any autofill is valid, any selected address is valid.
				if (initData?.coordinates?.latitude === 0 && initData?.coordinates?.longitude === 0) {
					throw new Error("Coordinates are invalid. Please try again.");
				}

				updateLocation(stop.id, initData);
				setOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleAddTimeWindow = (timeWindow: TimeWindow) => {
		// Check if the time window exists already
		const exists = initData.time_windows.find(
			(tw) => tw.startTime === timeWindow.startTime && tw.endTime === timeWindow.endTime
		);

		// TODO: Add user feedback for duplicate time windows
		if (!exists) setInitData({ ...initData, time_windows: [...initData.time_windows, timeWindow] });
		else throw new Error("Time window already exists. Please try again.");
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
											<Dialog.Title className="text-3xl font-semibold leading-6 text-gray-900">View Stop</Dialog.Title>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											<form ref={tableData} onSubmit={handleSubmit} className="h-full flex flex-col">
												<section>
													<div className="flex flex-row  p-2 gap-4">
														<label className="w-3/5">
															<span>Customer Name</span>
															<input
																type="text"
																name="customer_name"
																placeholder="e.g. Bob Smith"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-50 rounded-lg shadow-sm sm:flex  ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.customer_name}
																readOnly
															/>
														</label>
													</div>
													<div className="flex flex-row  p-2 gap-4">
														<label className="w-full">
															<span>Address</span>
															<input
																type="text"
																name="address"
																placeholder="e.g. 123 Main St"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-50 rounded-lg shadow-sm sm:flex  ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.address}
																readOnly
															/>
														</label>
													</div>
													<div className="flex gap-4 p-2">
														<label>
															<Hint
																label="Drop Off Duration"
																description="How long (roughly in minutes) should the drop off take? This is from when the driver
																arrives at the stop to when they leave."
															/>
															<input
																name="drop_off_duration"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-50 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.drop_off_duration}
																readOnly
																aria-label="Drop Off Duration"
															/>
														</label>
														<label>
															<Hint
																label="Priority"
																description="	On a scale of 1 to 100, with 1 being the highest and 100 being the lowest, rate the
															priority of this stop."
															/>
															<input
																name="priority"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-50 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
																value={initData?.priority}
																readOnly
																aria-label="Priority"
															/>
														</label>
													</div>

													<div className="flex p-2 flex-col ">
														<Hint
															label="Time Windows"
															description="When can the delivery be made? If you don't have a time window, leave this blank."
														/>

														<div className="w-1/2 mt-4 rounded-lg shadow-sm bg-slate-50">
															{initData.time_windows.map((tw, index) => (
																<div key={index} className="flex gap-4 items-center  odd:bg-slate-200 p-2 h-6">
																	{convertTime(tw.startTime)} to {convertTime(tw.endTime)}
																</div>
															))}
														</div>
													</div>
												</section>
												<div className="mt-auto w-full flex py-4 justify-end">
													<button
														onClick={() => setOpen(false)}
														className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
														{" "}
														Close
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
export default ViewStop;
