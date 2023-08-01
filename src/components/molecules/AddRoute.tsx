import useTable from "@/hooks/useTable";
import { useRouteStore } from "@/store";
import { fetchAddressData } from "@/utils/geocodeAddress";
import getFormValues from "@/utils/getFormValues";
import { Dialog, Transition } from "@headlessui/react";
import { QuestionMarkCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { uniqueId } from "lodash";
import { ChangeEvent, FC, FormEvent, Fragment, createRef, useEffect, useRef, useState } from "react";
import { LoadingIndicator } from "../atoms";
import TimeWindowInput from "./TimeWindowInput";
interface TimeWindowData {
	startTime: string;
	endTime: string;
}

import { Location } from "@/types";
import { classNames } from "@/utils/styles";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import AutocompleteAddressInput from "../AutoComplete";

interface ModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	addresses: any;
	stop: any;
	setStop: (stop: any) => void;
}
const MyModal: FC<ModalProps> = ({ isOpen, setIsOpen, addresses, stop, setStop }) => {
	const [selected, setSelected] = useState<any>(0);

	const closeModal = () => setIsOpen(false);
	const openModal = () => setIsOpen(true);

	const saveAndCloseModal = () => {
		if (selected) {
			const data = {
				...stop,
				coordinates: {
					latitude: selected.lat,
					longitude: selected.lon,
				},
				address: selected.display_name,
			};

			console.log(data);
			setStop(data);
		}
		closeModal();
	};

	useEffect(() => {
		if (addresses && addresses?.length > 0) {
			setSelected(addresses[0]);
		}
	}, [addresses]);

	return (
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
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
									Verify Address
								</Dialog.Title>
								<div className="mt-2">
									<p>
										The address you entered seemed to have multiple matches. Please select the correct address to
										continue.
									</p>
									<label htmlFor="address_options" className="sr-only">
										Address Options
									</label>

									<Listbox value={selected} onChange={setSelected}>
										{({ open }) => (
											<>
												<div className="relative mt-2">
													<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
														<span className="flex items-center">
															<span className="ml-3 block truncate">{selected?.display_name}</span>
														</span>
														<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
															<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
														</span>
													</Listbox.Button>

													<Transition
														show={open}
														as={Fragment}
														leave="transition ease-in duration-100"
														leaveFrom="opacity-100"
														leaveTo="opacity-0">
														<Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
															{addresses.map((address: any, idx: number) => (
																<Listbox.Option
																	key={idx}
																	className={({ active }) =>
																		classNames(
																			active ? "bg-indigo-600 text-white" : "text-gray-900",
																			"relative cursor-default select-none py-2 pl-3 pr-9"
																		)
																	}
																	value={address}>
																	{({ selected, active }) => (
																		<>
																			<div className="flex items-center">
																				<span
																					className={classNames(
																						selected ? "font-semibold" : "font-normal",
																						"ml-3 block truncate"
																					)}>
																					{address?.display_name}
																				</span>
																			</div>

																			{selected ? (
																				<span
																					className={classNames(
																						active ? "text-white" : "text-indigo-600",
																						"absolute inset-y-0 right-0 flex items-center pr-4"
																					)}>
																					<CheckIcon className="h-5 w-5" aria-hidden="true" />
																				</span>
																			) : null}
																		</>
																	)}
																</Listbox.Option>
															))}
														</Listbox.Options>
													</Transition>
												</div>
											</>
										)}
									</Listbox>
								</div>

								<div className="mt-4">
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
										onClick={closeModal}>
										Cancel
									</button>
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										onClick={saveAndCloseModal}>
										Save and Close
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

interface IProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}
const AddRoute: FC<IProps> = ({ open, setOpen }) => {
	const dataKey = "locations";

	const [isAddressModalOpen, setAddressModalOpen] = useState(false);
	const tableData = createRef<HTMLFormElement>();
	const locations = useRouteStore((state) => state.locations);
	const appendLocation = useRouteStore((state) => state.appendLocation);

	const [addresses, setAddresses] = useState([]);

	const [initData, setInitData] = useState<Location>({
		id: parseInt(uniqueId()),
		customer_name: "",
		address: "",
		drop_off_duration: 0,
		time_windows: [{ startTime: "00:00", endTime: "00:00" }],
		priority: 1,
		coordinates: { latitude: 0, longitude: 0 },
	});

	const saveRoute = async () => {
		const formData = getFormValues(tableData);

		if (formData.address == "") return;

		await fetchAddressData(formData.address).then((data) => {
			if (data.length > 1 || (initData?.coordinates?.latitude == 0 && initData?.coordinates?.longitude == 0)) {
				console.log(data);
				setAddresses(data);
				setAddressModalOpen(true);
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

		appendLocation(initData);
		setOpen(false);
	};

	const [timeWindows, setTimeWindows] = useState<TimeWindowData[]>([]);

	const handleAddTimeWindow = (timeWindow: TimeWindowData) => {
		setTimeWindows([...timeWindows, timeWindow]);
	};

	const updateData = (e: ChangeEvent<HTMLInputElement>) => {
		setInitData({
			...initData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		saveRoute();
	};
	useEffect(() => {
		if (open) {
			setInitData({
				id: parseInt(uniqueId()),
				customer_name: "",
				address: "",
				drop_off_duration: 0,
				time_windows: [{ startTime: "00:00", endTime: "00:00" }],
				priority: 1,
				coordinates: { latitude: 0, longitude: 0 },
			});
		}
	}, [open]);

	useEffect(() => {
		if (timeWindows.length > 0) {
			setInitData({ ...initData, time_windows: timeWindows });
		}
	}, [timeWindows]);

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
											<Dialog.Title className="text-3xl font-semibold leading-6 text-gray-900">New Stop</Dialog.Title>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{" "}
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													Fill out the table below to start adding destinations to the map.
												</p>
											</div>
											<form
												ref={tableData}
												onSubmit={handleSubmit}
												className="h-full flex flex-col"
												onChange={() => console.log(getFormValues(tableData))}>
												<section>
													<div className="flex flex-row  p-2 gap-4">
														<label className="w-3/5">
															<span>Customer Name</span>
															<input
																type="text"
																name="customer_name"
																placeholder="e.g. Bob Smith"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex  ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																value={initData?.customer_name}
																onChange={updateData}
															/>
														</label>{" "}
													</div>
													<div className="flex flex-row  p-2 gap-4">
														<AutocompleteAddressInput setData={setAddress} />
													</div>
													<div className="flex gap-4 p-2">
														<label className=" ">
															<span className="flex justify-between">
																Drop Off Duration{" "}
																<span className="group relative w-max">
																	<QuestionMarkCircleIcon className="text-slate-400 w-6 h-6" />
																	<span className="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-200 text-slate-500 max-w-md rounded-md p-2 shadow-md">
																		How long (roughly in minutes) should the drop off take? This is from when the driver
																		arrives at the stop to when they leave.
																	</span>
																</span>
															</span>
															<input
																name="drop_off_duration"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																value={initData?.drop_off_duration}
																onChange={updateData}
															/>
														</label>
														<label className="">
															<span className="flex justify-between">
																Priority{" "}
																<span className="group relative w-max">
																	<QuestionMarkCircleIcon className="text-slate-400 w-6 h-6" />
																	<span className="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-200 text-slate-500 max-w-md rounded-md p-2 shadow-md">
																		On a scale of 1 to 100, with 1 being the highest and 100 being the lowest, rate the
																		priority of this stop.
																	</span>
																</span>
															</span>
															<input
																name="priority"
																type="number"
																className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																value={initData?.priority}
																onChange={updateData}
															/>
														</label>
													</div>

													<div className="flex p-2 flex-col ">
														<span className="flex gap-4">
															Time Windows
															<span className="group relative w-max">
																<QuestionMarkCircleIcon className="text-slate-400 w-6 h-6" />
																<span className="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-200 text-slate-500 max-w-md rounded-md p-2 shadow-md">
																	When can the delivery be made? If you don't have a time window, leave this blank.
																</span>
															</span>
														</span>

														<TimeWindowInput onAddTimeWindow={handleAddTimeWindow} />

														<div className="w-1/2 mt-4">
															{timeWindows.map((tw, index) => (
																<div key={index} className="flex gap-4 items-center py-0.5 ">
																	<span>
																		{tw.startTime} to {tw.endTime}
																	</span>{" "}
																	<TrashIcon
																		className="h-4 w-4"
																		onClick={() => {
																			console.log(index);
																			// setTimeWindows(timeWindows.splice(index, 1));
																		}}
																	/>
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
														Accept and Close
													</button>{" "}
													<button
														type="submit"
														className=" mx-2 px-3 py-2  font-semibold text-white bg-indigo-500 rounded hover:bg-indigo-700 disabled:bg-indigo-500/30 disabled:cursor-not-allowed text-sm"
														disabled={initData?.coordinates?.latitude === 0 && initData?.coordinates?.longitude === 0}>
														Accept and Add Another
													</button>
												</div>
											</form>
											<MyModal
												isOpen={isAddressModalOpen}
												setIsOpen={setAddressModalOpen}
												addresses={addresses}
												stop={initData}
												setStop={setInitData}
											/>
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
export default AddRoute;
