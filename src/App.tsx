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
		<main className="h-screen flex flex-col md:flex-row">
			<section className=" md:7/12 lg:w-9/12 bg-slate-500 h-full w-full z-0">
				<RoutingMap />
			</section>
			<section className="bg-slate-50 h-full md:w-3/12 flex flex-col justify-between  w-full ">
				<div className="w-full px-4 py-4 sm:px-0 h-5/6">
					<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
						<Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-5 w-5/6 mx-auto">
							<Tab key={"tab-0"} className={({ selected }) => calculateTabTailwind(selected)}>
								Destinations
							</Tab>
							<Tab key={"tab-1"} className={({ selected }) => calculateTabTailwind(selected)}>
								Drivers
							</Tab>
							<Tab key={"tab-2"} className={({ selected }) => calculateTabTailwind(selected)}>
								Calculate Routes
							</Tab>
						</Tab.List>
						<Tab.Panels className="mt-2 h-full px-8">
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
				</div>
				<div className={`w-10/12  mx-auto px-10  my-10 py-3 rounded-xl  flex  gap-2 bg-slate-200`}>
					<PrevBtn clickHandler={prevTab} isDisabled={selectedIndex <= 0} />
					<NextBtn clickHandler={nextTab} isDisabled={selectedIndex >= 2} />
				</div>
			</section>
		</main>
	);
}

export default App;
