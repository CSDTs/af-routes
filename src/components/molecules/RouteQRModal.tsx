import { supabase } from "@/utils/db";
import { jsonToFile } from "@/utils/parsingData";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import RouteQRCode from "./RouteQRCode";

const RouteQRModal = ({ data }: any) => {
	let [isOpen, setIsOpen] = useState(false);

	const [fileID, setFileID] = useState("");

	const closeModal = () => setIsOpen(false);

	async function openModal() {
		if (data) {
			// Take that name and shorten it to 50 characters, making sure that it it stays unique. data.geometry must always turn into this
			const fileName = data.geometry
				.replace(/[^a-z0-9]/gi, "_")
				.toLowerCase()
				.substring(0, 50);

			const file = jsonToFile(data, `${fileName}.json`);

			const { data: listData, error: listError } = await supabase.storage.from("routes").list();
			//Check if file name exists in listData
			if (listData) {
				const fileExists = listData.some((file) => file.name === `${fileName}.json`);
				if (!fileExists) {
					const { data: fileData, error } = await supabase.storage.from("routes").upload(file.name, file);
					if (error) {
						console.error("Error uploading file:", error);
						setFileID("");
						setIsOpen(false);
					} else {
						console.log("File uploaded successfully:", fileData);
						setFileID(fileName);
						setIsOpen(true);
					}
				} else {
					console.log("File already exists", `${fileName}.json`);
					setFileID(fileName);
					setIsOpen(true);
				}
			}
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={openModal}
				className="rounded-md  px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
				<span className="sr-only">Generate QR Code</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
					/>
				</svg>
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
								<Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Route QR Code for {data.description}
									</Dialog.Title>
									<div className="mt-2 w-full h-full">{fileID && <RouteQRCode url={fileID} />}</div>

									<div className="mt-4 w-full flex gap-x-2">
										<button
											type="button"
											className="mr-auto inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
											onClick={closeModal}>
											Close
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
};
export default RouteQRModal;
