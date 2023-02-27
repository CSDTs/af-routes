import { Disclosure, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { Fragment, MouseEventHandler, useEffect, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import useDebounce from "../hooks/useDebounce";

import data from "../data/addresses.json";
const solutions = [
	{
		name: "Insights",
		description: "Measure actions your users take",
		href: "##",
		icon: IconOne,
	},
	{
		name: "Automations",
		description: "Create your own targeted content",
		href: "##",
		icon: IconTwo,
	},
	{
		name: "Reports",
		description: "Keep track of your growth",
		href: "##",
		icon: IconThree,
	},
];

export default function RouteResults() {
	const [load, setLoad] = useState(false);
	const [restart, setRestart] = useState(false);

	const email = useRef(null);

	useDebounce(() => setRestart(true), 5000, [load]);

	const sendRouteData = (e: any) => {
		e.preventDefault();

		console.log(email?.current?.value);

		window.location.href =
			`mailto:${email?.current?.value}?subject=Routes for [Insert Name]&body=` +
			encodeURIComponent(JSON.stringify(data));
	};

	if (!load) {
		return (
			<>
				<button
					className={`mt-8 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-lg font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2`}
					onClick={() => setLoad(true)}>
					Generate my routes
				</button>
			</>
		);
	}
	return (
		<>
			{restart && (
				<>
					<div className="w-full px-4 pt-16">
						<div className="mx-auto w-full rounded-2xl bg-white p-2">
							<Disclosure>
								{({ open }) => (
									<>
										<Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
											<div className="flex items-center space-x-4">
												<div className="flex-shrink-0">
													<div className="w-8 h-8 rounded-full bg-slate-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 truncate ">Route One</p>
													<p className="text-sm text-gray-500 truncate">Driver: John Smith</p>
												</div>
											</div>
											<ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-blue-500`} />
										</Disclosure.Button>
										<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
											<ol className="relative border-l border-gray-200">
												<li className="mb-10 ml-4">
													<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
													<p className="mb-1 text-base font-normal leading-none text-gray-500">
														2121 Oak Valley Dr, Ann Arbor, MI 48103, United States
													</p>

													<div className=" flex mb-4 space-x-1 text-sm font-normal text-gray-400">
														<span>42.2542447, -83.7778416</span>
														<span>&middot;</span>
														<span>15 mins</span>
														<span>&middot;</span>
														<span>Normal Priority</span>
													</div>
												</li>
												<li className="mb-10 ml-4">
													<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
													<p className="mb-1 text-base font-normal leading-none text-gray-500">
														767 N University Ave, Ann Arbor, MI 48109, United States
													</p>

													<div className=" flex mb-4 space-x-1 text-sm font-normal text-gray-400">
														<span>42.2787389, -83.7401024</span>
														<span>&middot;</span>
														<span>5 mins</span>
														<span>&middot;</span>
														<span>High Priority</span>
													</div>
												</li>{" "}
												<li className="ml-4">
													<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
													<p className="mb-1 text-base font-normal leading-none text-gray-500">
														1201 S Main St, Ann Arbor, MI 48104, United States
													</p>

													<div className=" flex mb-4 space-x-1 text-sm font-normal text-gray-400">
														<span>42.2666423, 83.7499573</span>
														<span>&middot;</span>
														<span>23 mins</span>
														<span>&middot;</span>
														<span>Normal Priority</span>
													</div>
												</li>
											</ol>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
							<Disclosure as="div" className="mt-2">
								{({ open }) => (
									<>
										<Disclosure.Button className="flex w-full justify-between items-center rounded-lg bg-green-100 px-4 py-2 text-left text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
											<div className="flex items-center space-x-4">
												<div className="flex-shrink-0">
													<div className="w-8 h-8 rounded-full bg-slate-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 truncate ">Route Two</p>
													<p className="text-sm text-gray-500 truncate">Driver: Deborah Ann</p>
												</div>
											</div>
											<ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-green-500`} />
										</Disclosure.Button>
										<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
											{" "}
											<ol className="relative border-l border-gray-200">
												<li className="mb-10 ml-4">
													<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
													<p className="mb-1 text-base font-normal leading-none text-gray-500">
														220 E Ann St, Ann Arbor, MI 48104, United States
													</p>

													<div className=" flex mb-4 space-x-1 text-sm font-normal text-gray-400">
														<span>42.2542447, -83.7778416</span>
														<span>&middot;</span>
														<span>30 mins</span>
														<span>&middot;</span>
														<span>Normal Priority</span>
													</div>
												</li>

												<li className="ml-4">
													<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
													<p className="mb-1 text-base font-normal leading-none text-gray-500">
														1800 N Dixboro Rd, Ann Arbor, MI 48105, United States
													</p>

													<div className=" flex mb-4 space-x-1 text-sm font-normal text-gray-400">
														<span>42.2666423, 83.7499573</span>
														<span>&middot;</span>
														<span>23 mins</span>
														<span>&middot;</span>
														<span>Normal Priority</span>
													</div>
												</li>
											</ol>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>{" "}
							<Disclosure as="div" className="mt-2">
								{({ open }) => (
									<>
										<Disclosure.Button className="flex w-full justify-between items-center rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
											<div className="flex items-center space-x-4">
												<div className="flex-shrink-0">
													<div className="w-8 h-8 rounded-full bg-slate-600" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 truncate ">Route Three</p>
													<p className="text-sm text-gray-500 truncate">Driver: Myke Smith</p>
												</div>
											</div>
											<ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-purple-500`} />
										</Disclosure.Button>
										<Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
											{" "}
											<ol className="relative border-l border-gray-200">
												<li className="mb-10 ml-4">
													<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
													<p className="mb-1 text-base font-normal leading-none text-gray-500">
														304 S Ashley St, Ann Arbor, MI 48104, United States
													</p>

													<div className=" flex mb-4 space-x-1 text-sm font-normal text-gray-400">
														<span>42.2542447, -83.7778416</span>
														<span>&middot;</span>
														<span>30 mins</span>
														<span>&middot;</span>
														<span>Normal Priority</span>
													</div>
												</li>

												<li className="ml-4">
													<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
													<p className="mb-1 text-base font-normal leading-none text-gray-500">
														8801 N Territorial Rd, Dexter, MI 48130, United States
													</p>

													<div className=" flex mb-4 space-x-1 text-sm font-normal text-gray-400">
														<span>42.2666423, 83.7499573</span>
														<span>&middot;</span>
														<span>23 mins</span>
														<span>&middot;</span>
														<span>Normal Priority</span>
													</div>
												</li>
											</ol>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
						</div>
					</div>

					<div className=" w-full gap-3 px-4 flex items-center mt-8 justify-center">
						<button
							className={`   justify-center flex  rounded-md border border-transparent bg-slate-100 px-4 py-2 text-base font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2`}
							onClick={() => {
								setRestart(false);
								setLoad(false);
							}}>
							Restart
						</button>

						<Popover className="relative ">
							{({ open }) => (
								<>
									<Popover.Button
										className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
										<span>Share</span>
										<ChevronDownIcon
											className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5 text-green-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
											aria-hidden="true"
										/>
									</Popover.Button>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-200"
										enterFrom="opacity-0 translate-y-1"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in duration-150"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 translate-y-1">
										<Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md">
											<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
												{/* <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
													{solutions.map((item) => (
														<a
															key={item.name}
															href={item.href}
															className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-50">
															<div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
																<item.icon aria-hidden="true" />
															</div>
															<div className="ml-4">
																<p className="text-sm font-medium text-gray-900">{item.name}</p>
																<p className="text-sm text-gray-500">{item.description}</p>
															</div>
														</a>
													))}
												</div> */}
												<form className="bg-gray-50 p-4" onSubmit={sendRouteData}>
													<a
														href="##"
														className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-50">
														<span className="flex items-center">
															<span className="text-sm font-medium text-gray-900">Share via email</span>
														</span>
														<span className="block text-sm text-gray-500">Enter a driver's email to send routes</span>
														<div
															data-element="fields"
															data-stacked="false"
															className="flex items-center w-full max-w-md mb-3 seva-fields formkit-fields mt-2">
															<div className="relative w-full mr-3 formkit-field">
																<label
																	htmlFor="member_email"
																	className="hidden  mb-2 text-sm font-medium text-gray-900 ">
																	Email address
																</label>
																<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
																	<svg
																		className="w-4 h-4 text-gray-500 "
																		fill="currentColor"
																		viewBox="0 0 20 20"
																		xmlns="http://www.w3.org/2000/svg">
																		<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
																		<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
																	</svg>
																</div>
																<input
																	ref={email}
																	id="member_email"
																	className="formkit-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 "
																	name="email_address"
																	aria-label="Email Address"
																	placeholder="Your email address..."
																	type="email"
																/>
															</div>
															<button data-element="submit" className="formkit-submit" type="submit">
																<div className="formkit-spinner">
																	<div></div>
																	<div></div>
																	<div></div>
																</div>
																<span className="px-5 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 ">
																	Send
																</span>
															</button>
														</div>
													</a>
												</form>
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
					</div>
				</>
			)}
			{!restart && <PuffLoader color={"#000000"} loading={load} size={50} />}
		</>
	);
}
function IconOne() {
	return (
		<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="48" height="48" rx="8" fill="#FFEDD5" />
			<path d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z" stroke="#FB923C" strokeWidth="2" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
				stroke="#FDBA74"
				strokeWidth="2"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
				stroke="#FDBA74"
				strokeWidth="2"
			/>
		</svg>
	);
}

function IconTwo() {
	return (
		<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="48" height="48" rx="8" fill="#FFEDD5" />
			<path
				d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
				stroke="#FB923C"
				strokeWidth="2"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
				stroke="#FDBA74"
				strokeWidth="2"
			/>
		</svg>
	);
}

function IconThree() {
	return (
		<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="48" height="48" rx="8" fill="#FFEDD5" />
			<rect x="13" y="32" width="2" height="4" fill="#FDBA74" />
			<rect x="17" y="28" width="2" height="8" fill="#FDBA74" />
			<rect x="21" y="24" width="2" height="12" fill="#FDBA74" />
			<rect x="25" y="20" width="2" height="16" fill="#FDBA74" />
			<rect x="29" y="16" width="2" height="20" fill="#FB923C" />
			<rect x="33" y="12" width="2" height="24" fill="#FB923C" />
		</svg>
	);
}
