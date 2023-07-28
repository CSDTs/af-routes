import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
<div className="absolute right-0 top-0 -mr-8 flex pr-2 pt-4 sm:-mr-10 sm:pr-4"></div>;
export default function SlideOver({ open, setOpen }) {
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
								<Dialog.Panel className="pointer-events-auto relative w-screen max-w-6xl">
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
											<label className="block">
												<span> Address</span>
												<input
													type="text"
													placeholder="e.g. 23600 Heidelberg St, Detroit, MI 48207, United States"
													className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
												/>
											</label>
											<label className="block">
												<span> Customer Name</span>
												<input
													type="text"
													placeholder="e.g. Bob Smith"
													className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
												/>
											</label>
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
																<tr className="odd:bg-slate-50 even:bg-slate-200">
																	<td className="w-5/12 px-4 py-2 border">
																		<div className="relative">
																			<div className="flex flex-col gap-2">
																				<label className="block">
																					<span className="sr-only">Starting Address</span>
																					<input
																						type="text"
																						placeholder="e.g. 23600 Heidelberg St, Detroit, MI 48207, United States"
																						className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																					/>
																				</label>
																			</div>
																		</div>
																	</td>
																	<td className="px-4 py-2 border">
																		<label className="block">
																			<span className="sr-only">Drop Off Duration</span>
																			<input
																				type="number"
																				className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																			/>
																		</label>
																	</td>
																	<td className="px-4 py-2 border">
																		<div className="flex flex-col">
																			<label className="block">
																				<span className="block text-sm font-medium text-slate-700">Start</span>
																				<input
																					type="time"
																					className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																				/>
																			</label>{" "}
																			<label className="block">
																				<span className="block text-sm font-medium text-slate-700">End</span>
																				<input
																					type="time"
																					className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																				/>
																			</label>
																		</div>
																	</td>
																	<td className="px-4 py-2 border">
																		<label className="block">
																			<span className="sr-only">Priority</span>
																			<input
																				type="number"
																				className="items-center  w-full h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 "
																			/>
																		</label>
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
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
}
