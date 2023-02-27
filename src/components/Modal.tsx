import { Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";

export default function Modal({ title, data, setData, children }) {
	const [isOpen, setIsOpen] = useState(false);

	const closeModal = () => setIsOpen(false);
	const openModal = () => setIsOpen(true);

	const buttons = [
		{
			name: "Finish",
			color: "blue",
			callback: closeModal,
		},
	];
	return (
		<>
			<button
				type="button"
				onClick={openModal}
				className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
				{(data && data.length > 1 && "Edit") || "Fill"} Table
			</button>
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
										{title}
									</Dialog.Title>
									{children}

									<div className="mt-4 flex gap-2">
										{buttons &&
											buttons.map((button) => {
												return (
													<button
														type="button"
														className={`inline-flex justify-center rounded-md border border-transparent bg-${button.color}-100 px-4 py-2 text-sm font-medium text-${button.color}-900 hover:bg-${button.color}-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-${button.color}-500 focus-visible:ring-offset-2`}
														onClick={button.callback}>
														{button.name}
													</button>
												);
											})}
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
