import { classNames } from "@/utils/styles";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { FC, Fragment, useEffect, useState } from "react";

interface IProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	addresses: any;
	stop: any;
	setStop: (stop: any) => void;
}

const AddressSelectPrompt: FC<IProps> = ({ isOpen, setIsOpen, addresses, stop, setStop }) => {
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

export default AddressSelectPrompt;
