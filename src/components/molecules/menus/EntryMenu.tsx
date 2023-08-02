import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { AnyMxRecord } from "dns";
import { FC, Fragment, useEffect, useRef, useState } from "react";

interface IProps {
	editCallback: () => void;
}
const EntryMenu: FC<IProps> = ({ editCallback }) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-800 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:text-indigo-500">
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
							d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
						/>
					</svg>
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95">
				<Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={() => editCallback()}
									className={`${
										active ? "bg-indigo-500 text-white" : "text-gray-900"
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
									{active ? (
										<EditActiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
									) : (
										<EditInactiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
									)}
									Edit
								</button>
							)}
						</Menu.Item>
					</div>
					{/* 
					<div className="px-1 py-1">
						<Menu.Item disabled>
							{({ active }) => (
								<button
									className={`${
										active ? "bg-indigo-500 text-white" : "text-gray-900"
									} group flex w-full items-center rounded-md px-2 py-2 text-sm `}>
									{active ? (
										<DeleteActiveIcon className="mr-2 h-5 w-5 text-indigo-400" aria-hidden="true" />
									) : (
										<DeleteInactiveIcon className="mr-2 h-5 w-5 text-indigo-400" aria-hidden="true" />
									)}
									Delete
								</button>
							)}
						</Menu.Item>
					</div> */}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default EntryMenu;

function EditInactiveIcon(props: any) {
	return (
		<svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 13V16H7L16 7L13 4L4 13Z" fill="#EDE9FE" stroke="#6366f1" strokeWidth="2" />
		</svg>
	);
}

function EditActiveIcon(props: any) {
	return (
		<svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 13V16H7L16 7L13 4L4 13Z" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
		</svg>
	);
}
