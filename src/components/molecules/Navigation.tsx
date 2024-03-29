import { classNames } from "@/utils/styles";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Squares2X2Icon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

const navigation = [
	{ name: "Routing", href: "/", current: true },
	// { name: "Routing", href: "/routing", current: true },
	// { name: "Orders", href: "/orders", current: false },
	// { name: "Tracking", href: "/tracking", current: false },
	// { name: "Messaging", href: "/messaging", current: false },
];

export default function Navigation() {
	return (
		<Disclosure as="nav" className="bg-gradient-to-br from-indigo-600 to-indigo-900">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-2">
						<div className="relative flex h-8 items-center justify-between ">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center divide-x gap-2">
									<img className="h-6 w-auto" src="/logo_white.png" alt="Your Company" />
									<p className="text-white font-bold flex h-fit px-2">Artisanal Futures Routing</p>
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
								<button
									type="button"
									className="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
									<span className="sr-only">View notifications</span>
									<Squares2X2Icon className="h-6 w-6" aria-hidden="true" />
								</button>
								<button
									type="button"
									className="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ml-3">
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>{" "}
								<button
									type="button"
									className="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ml-3">
									<span className="sr-only">View notifications</span>
									<QuestionMarkCircleIcon className="h-6 w-6" aria-hidden="true" />
								</button>
								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="sr-only">Open user menu</span>
											<img
												className="h-8 w-8 rounded-full"
												src="https://avatars.dicebear.com/api/identicon/artisanal_futures.svg"
												alt=""
											/>
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
										<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<Menu.Item>
												{({ active }) => (
													<a
														href="#"
														className={classNames(
															active ? "bg-gray-100" : "",
															"block px-4 py-2 text-sm text-gray-700"
														)}>
														Your Profile
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="#"
														className={classNames(
															active ? "bg-gray-100" : "",
															"block px-4 py-2 text-sm text-gray-700"
														)}>
														Settings
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="#"
														className={classNames(
															active ? "bg-gray-100" : "",
															"block px-4 py-2 text-sm text-gray-700"
														)}>
														Sign out
													</a>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>
					<div className="mx-auto max-w-7xl   py-2">
						<div className="relative flex h-8 items-center justify-between">
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4">
										{navigation.map((item) => (
											<NavLink
												key={item.name}
												to={item.href}
												className={({ isActive }) =>
													classNames(
														isActive
															? " text-white border-b-white"
															: "text-gray-300  hover:text-white border-b-transparent hover:border-b-white",
														" px-3 py-1 text-sm font-medium border-b-2 "
													)
												}
												aria-current={item.current ? "page" : undefined}>
												{item.name}
											</NavLink>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 px-2 pb-3 pt-2">
							{navigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={item.href}
									className={classNames(
										item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
										"block rounded-md px-3 py-2 text-base font-medium"
									)}
									aria-current={item.current ? "page" : undefined}>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
