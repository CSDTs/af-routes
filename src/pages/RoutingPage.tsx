import { Tab } from "@headlessui/react";

import { useState } from "react";

import DriversTab from "@/components/organisms/DriversTab";
import RoutingMap from "@/components/organisms/RoutingMap";
import StopsTab from "@/components/organisms/StopsTab";

import CalculationsTab from "@/components/organisms/CalculationsTab";

import { classNames } from "@/utils/styles";

/**
 * Page component that allows users to generate routes based on their input.
 */
const RoutingPage = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const tabBtnStyle =
		"w-full py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none ";

	return (
		<div className="flex">
			<section className="flex flex-col justify-between w-full bg-white h-6/12 md:w-full lg:w-5/12 lg:h-full xl:w-4/12 2xl:w-3/12">
				<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
					<Tab.List className="flex mx-auto mb-5 space-x-1  border-b-indigo-500/20 border-b-4 w-full pt-3 pb-0">
						<Tab
							key={"tab-0"}
							className={({ selected }) =>
								classNames(
									tabBtnStyle,
									selected
										? " border-b-2 border-b-indigo-500 mb-0 font-bold"
										: " hover:bg-indigo-700/20 hover:text-white"
								)
							}>
							Stops
						</Tab>
						<Tab
							key={"tab-1"}
							className={({ selected }) =>
								classNames(
									tabBtnStyle,
									selected
										? " border-b-2 border-b-indigo-500 mb-0 font-bold"
										: " hover:bg-indigo-700/20 hover:text-white"
								)
							}>
							Drivers
						</Tab>
						<Tab
							key={"tab-2"}
							className={({ selected }) =>
								classNames(
									tabBtnStyle,
									selected
										? " border-b-2 border-b-indigo-500 mb-0 font-bold"
										: " hover:bg-indigo-700/20 hover:text-white"
								)
							}>
							Calculate
						</Tab>
					</Tab.List>
					<Tab.Panels className="h-full  overflow-y-auto flex flex-col">
						<Tab.Panel key={0} className="rounded-xl p-3 h-full flex flex-col">
							<StopsTab />
						</Tab.Panel>
						<Tab.Panel key={1} className="rounded-xl p-3 h-full flex flex-col">
							<DriversTab />
						</Tab.Panel>
						<Tab.Panel key={2} className="rounded-xl p-3 h-full flex flex-col">
							<CalculationsTab />
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
			</section>
			<section className="z-0 w-full overflow-hidden md:w-full lg:w-7/12 xl:w-9/12 2xl:w-9/12 bg-slate-500 h-6/12 lg:h-full aspect-square lg:aspect-auto relative">
				<RoutingMap />
			</section>
		</div>
	);
};

export default RoutingPage;
