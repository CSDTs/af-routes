import { Tab } from "@headlessui/react";

import { useState } from "react";

import DestinationsTab from "@/components/organisms/DestinationsTab";
import DriversTab from "@/components/organisms/DriversTab";
import RoutingMap from "@/components/organisms/RoutingMap";

import { NextBtn, PrevBtn } from "@/components/atoms";

import CalculationsTab from "@/components/organisms/CalculationsTab";
import { classNames } from "@/utils/styles";

function calculateTabTailwind(selected: boolean) {
	const tabBtnStyle =
		" w-full py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none ";

	return classNames(
		tabBtnStyle,
		selected ? " border-b-2 border-b-indigo-500 mb-0 font-bold" : " hover:bg-indigo-700/20 hover:text-white"
	);
}
const RoutingPage = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const tabPanelStyle = classNames(
		"rounded-xl p-3 h-full flex flex-col  ",
		"ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
	);

	const nextTab = () => setSelectedIndex(selectedIndex + 1);
	const prevTab = () => setSelectedIndex(selectedIndex - 1);

	return (
		<div className="flex">
			<section className="flex flex-col justify-between w-full bg-white h-6/12 md:w-full lg:w-5/12 lg:h-full xl:w-4/12 2xl:w-3/12 3xl:w-2/12">
				{/* <div className="w-full py-4 lg:px-2 xl:px-4 flex flex-col grow lg:py-8 "> */}
				<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
					<Tab.List className="flex mx-auto mb-5 space-x-1  border-b-indigo-500/20 border-b-4 w-full pt-3 pb-0">
						<Tab key={"tab-0"} className={({ selected }) => calculateTabTailwind(selected)}>
							Destinations
						</Tab>
						<Tab key={"tab-1"} className={({ selected }) => calculateTabTailwind(selected)}>
							Drivers
						</Tab>
						<Tab key={"tab-2"} className={({ selected }) => calculateTabTailwind(selected)}>
							Calculate
						</Tab>
					</Tab.List>
					<Tab.Panels className="h-full  overflow-y-auto flex flex-col">
						<Tab.Panel key={0} className={tabPanelStyle}>
							<div className="mb-3">
								<label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900 sr-only">
									Location
								</label>
								<div className="relative rounded-md shadow-sm">
									<input
										type="text"
										name="location"
										id="location"
										className="block w-full rounded-md border-0 py-1.5 pl-3.5 pr-20 text-gray-900  ring-inset ring-gray-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 bg-slate-100"
										placeholder="e.g. 112 Main Street, Detroit"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center ">
										<button>
											<span className="sr-only">Search</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-4 h-4 mr-2 text-gray-500">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>

							<DestinationsTab />
						</Tab.Panel>
						<Tab.Panel key={1} className={tabPanelStyle}>
							<DriversTab />
						</Tab.Panel>
						<Tab.Panel key={2} className={tabPanelStyle}>
							<CalculationsTab />
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
				{/* </div>{" "} */}
				{/* <div className="flex items-center self-center w-full py-4 lg:px-2 xl:px-4 h-5/6 lg:py-8">
					<div className="flex items-center self-center w-full gap-2 px-8 py-4 mt-2">
						<PrevBtn clickHandler={prevTab} isDisabled={selectedIndex <= 0} />
						<NextBtn clickHandler={nextTab} isDisabled={selectedIndex >= 2} />
					</div>
				</div> */}
			</section>
			<section className="z-0 w-full overflow-hidden md:w-full lg:w-7/12 xl:w-9/12 2xl:w-10/12 bg-slate-500 h-6/12 lg:h-full aspect-square lg:aspect-auto">
				<RoutingMap />
			</section>
		</div>
	);
};

export default RoutingPage;
