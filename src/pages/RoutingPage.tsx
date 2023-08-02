import { Tab } from "@headlessui/react";

import { useState } from "react";

import DriversTab from "@/components/organisms/DriversTab";
import RoutingMap from "@/components/organisms/RoutingMap";
import StopsTab from "@/components/organisms/StopsTab";

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
	const [stopType, setStopType] = useState("pickup");

	const tabPanelStyle = classNames("rounded-xl p-3 h-full flex flex-col  ");

	const nextTab = () => setSelectedIndex(selectedIndex + 1);
	const prevTab = () => setSelectedIndex(selectedIndex - 1);

	return (
		<div className="flex">
			<section className="flex flex-col justify-between w-full bg-white h-6/12 md:w-full lg:w-5/12 lg:h-full xl:w-4/12 2xl:w-4/12">
				{/* <div className="w-full py-4 lg:px-2 xl:px-4 flex flex-col grow lg:py-8 "> */}
				<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
					<Tab.List className="flex mx-auto mb-5 space-x-1  border-b-indigo-500/20 border-b-4 w-full pt-3 pb-0">
						<Tab key={"tab-0"} className={({ selected }) => calculateTabTailwind(selected)}>
							Stops
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
							<StopsTab />
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
			<section className="z-0 w-full overflow-hidden md:w-full lg:w-7/12 xl:w-9/12 2xl:w-8/12 bg-slate-500 h-6/12 lg:h-full aspect-square lg:aspect-auto relative">
				{/* <div className="fixed z-1 bottom-0 right-0 p-4 bg-white/70 2xl:w-8/12 flex justify-end">
					<button className="bg-indigo-600 px-10 py-3  font-bold text-white rounded-md text-lg hover:bg-indigo-400">
						Calculate Routes
					</button>
				</div>{" "} */}
				<RoutingMap />
			</section>
		</div>
	);
};

export default RoutingPage;
