import { Tab } from "@headlessui/react";

import { useState } from "react";

import "./App.css";
import DestinationsTab from "./components/organisms/DestinationsTab";
import DriversTab from "./components/organisms/DriversTab";
import RoutingMap from "./components/organisms/RoutingMap";

import { NextBtn, PrevBtn } from "./components/atoms";

import CalculationsTab from "./components/organisms/CalculationsTab";
import { classNames } from "./utils/styles";

function calculateTabTailwind(selected: boolean) {
	const tabBtnStyle =
		"w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2";

	return classNames(tabBtnStyle, selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white");
}
function App() {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const tabPanelStyle = classNames(
		"rounded-xl bg-white p-3 h-full",
		"ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
	);

	const nextTab = () => setSelectedIndex(selectedIndex + 1);
	const prevTab = () => setSelectedIndex(selectedIndex - 1);

	return (
		<main className="flex flex-col h-full lg:h-screen lg:flex-row ">
			<section className="z-0 w-full overflow-hidden md:w-full lg:w-7/12 xl:w-9/12 bg-slate-500 h-6/12 lg:h-full aspect-square lg:aspect-auto">
				<RoutingMap />
			</section>
			<section className="flex flex-col justify-between w-full bg-slate-50 h-6/12 md:w-full lg:w-5/12 lg:h-full ">
				<div className="w-full py-4 lg:px-2 xl:px-4 h-5/6 lg:py-8 ">
					<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
						<Tab.List className="flex w-5/6 p-1 mx-auto mb-5 space-x-1 rounded-xl bg-blue-900/20 ">
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
						<Tab.Panels className="h-full px-8 mt-2 overflow-scroll">
							<Tab.Panel key={0} className={tabPanelStyle}>
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
				</div>{" "}
				<div className="flex items-center self-center w-full py-4 lg:px-2 xl:px-4 h-5/6 lg:py-8">
					<div className="flex items-center self-center w-full gap-2 px-8 py-4 mt-2">
						<PrevBtn clickHandler={prevTab} isDisabled={selectedIndex <= 0} />
						<NextBtn clickHandler={nextTab} isDisabled={selectedIndex >= 2} />
					</div>
				</div>
			</section>
		</main>
	);
}

export default App;
