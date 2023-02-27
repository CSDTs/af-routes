import { Tab } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import CalculateRoutes from "../components/CalculateRoutes";
import DriverTable from "../components/DriverTable";
import LocationTable from "../components/LocationTable";
import Tabs from "../components/Tabs";
import PrimaryButton from "../components/base/PrimaryButton";

import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import RouteResults from "../components/RouteResults";
import Header from "../components/base/Header";
import Subheader from "../components/base/Subheader";
import ListingHeader from "../components/listings/ListingHeader";
import ListingSubheader from "../components/listings/ListingSubheader";
import ListingUnorderedList from "../components/listings/ListingUnorderedList";
import { Coordinates, Driver, Location } from "../types";
interface LayoutProps {
	url: string;
}

/**
 * Combine strings of classes into a single string to improve Tailwind CSS readability.
 *
 * @param classes Array of class strings
 * @returns Combined class list for components
 */
function classNames(...classes: Array<string>) {
	return classes.filter(Boolean).join(" ");
}

/**
 * Communicates with iframe via postmessage to send data for OSRM frontend.
 *
 * Ideally, this will be updated to use better standards. For now, CORS sucks and this unblocks me to continue working...
 * @param coordinates Latitude and longitude object from locations data
 */
function addPointToMap(coordinates: Coordinates) {
	const MAP_APP = document.querySelector("iframe")?.contentWindow;

	if (MAP_APP)
		MAP_APP.postMessage({ option: "add-waypoint", lat: coordinates?.latitude, lng: coordinates?.longitude }, "*");
	else console.error("iFrame was not located. Please try again.");
}
function addAllDropOffPoints(locations: Array<Location>) {
	const MAP_APP = document.querySelector("iframe")?.contentWindow;

	if (MAP_APP) MAP_APP.postMessage({ option: "add-all-dropoffs", locations: locations }, "*");
	else console.error("iFrame was not located. Please try again.");
}

const fetchLocationCoordinates = (url: string, params: { address: string }) => axios.get(url).then((res) => res.data);

const TwoColumn = (props: LayoutProps) => {
	const [locations, setLocations] = useState<Location[]>([]);
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [calculateRoutes, isCalculatingRoutes] = useState<boolean>(false);

	const [selectedIndex, setSelectedIndex] = useState(0);

	const tabBtnStyle =
		"w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2";

	const tabPanelStyle = classNames(
		"rounded-xl bg-white p-3 h-full",
		"ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
	);
	useEffect(() => {
		// if (locations.length > 0 && locations[0]?.coordinates && locations[1]?.coordinates && locations[2]?.coordinates) {
		// 	addPointToMap(locations[0]?.coordinates);
		// 	addPointToMap(locations[1]?.coordinates);
		// 	addPointToMap(locations[2]?.coordinates);
		// }

		if (locations.length > 0) {
			addAllDropOffPoints(locations);
		}
	}, [locations]);

	return (
		<>
			<section className=" w-4/6 bg-slate-500 h-full ">
				<iframe src={props.url} className="w-full h-full" aria-label="Routing map"></iframe>
			</section>
			<section className="bg-slate-50 h-full w-2/6 flex flex-col justify-between">
				<div className="w-full px-4 py-4 sm:px-0 h-full">
					<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
						<Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-5 w-5/6 mx-auto">
							<Tab
								key={"tab-0"}
								className={({ selected }) =>
									classNames(
										tabBtnStyle,
										selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
									)
								}>
								Destinations
							</Tab>
							<Tab
								key={"tab-1"}
								className={({ selected }) =>
									classNames(
										tabBtnStyle,
										selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
									)
								}>
								Drivers
							</Tab>
							<Tab
								key={"tab-2"}
								className={({ selected }) =>
									classNames(
										tabBtnStyle,
										selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
									)
								}>
								Calculate Routes
							</Tab>
						</Tab.List>
						<Tab.Panels className="mt-2 h-full px-8">
							<Tab.Panel key={0} className={tabPanelStyle}>
								<Header>Destinations</Header>
								<Subheader>Fill in the table below to start adding destinations.</Subheader>

								<ul className="my-6">
									{locations.length > 0 &&
										locations[0].address != "" &&
										locations.map((listing, idx) => (
											<li key={idx} className="odd:bg-slate-300 even:bg-slate-100 p-3 m-1 font-medium">
												<ListingHeader>{listing.address}</ListingHeader>
												<ListingUnorderedList>
													<li>
														{listing.coordinates?.latitude || ""}, {listing.coordinates?.longitude || ""}
													</li>
													<li>&middot;</li>
													<li>{listing.drop_off} minutes</li>
													<li>&middot;</li>
													<li>{listing.is_high_priority ? "High" : "Normal"} priority</li>
												</ListingUnorderedList>
											</li>
										))}
								</ul>

								<LocationTable currentLocations={locations} handleLocationsUpdate={setLocations} />
							</Tab.Panel>
							<Tab.Panel key={1} className={tabPanelStyle}>
								<Header>Drivers</Header>
								<Subheader>Fill in the table below to start adding drivers to map.</Subheader>

								<ul className="my-6">
									{drivers.length > 0 &&
										drivers[0].starting_address != "" &&
										drivers.map((driver, idx) => (
											<li key={idx} className="odd:bg-slate-300 even:bg-slate-100 py-2 px-3 m-1 font-medium">
												<ListingHeader>{driver.full_name}</ListingHeader>
												<ListingSubheader>{driver.starting_address}</ListingSubheader>
												<ListingUnorderedList>
													<li>
														{driver.coordinates?.latitude || ""}, {driver.coordinates?.longitude || ""}
													</li>
													<li>&middot;</li>
													<li>{driver.max_travel_time} minutes</li>
													<li>&middot;</li>
													<li>{driver.max_stops} stops</li>
												</ListingUnorderedList>
											</li>
										))}
								</ul>
								<DriverTable currentDrivers={drivers} handleDriversUpdate={setDrivers} />
							</Tab.Panel>
							<Tab.Panel key={2} className={tabPanelStyle}>
								<Header>Calculate Routes</Header>
								<Subheader>Based on these results, generate routes!</Subheader>
								{/* 
								<button
									className={`mt-8 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-lg font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2`}
									onClick={() => isCalculatingRoutes(true)}>
									Generate my routes
								</button>
								{calculateRoutes && <CalculateRoutes locations={locations} drivers={drivers} />} */}
								<RouteResults />
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</div>

				<div className=" w-10/12 mx-auto my-3 flex justify-end">
					{/* <PrimaryButton name="I'm finished, calculate my routes." event={() => console.log(locations)} /> */}
					<div>
						<button
							onClick={() => setSelectedIndex(selectedIndex - 1)}
							className="bg-slate-700 font-semibold text-base text-white px-4 py-2 disabled:bg-slate-400 rounded"
							disabled={selectedIndex <= 0}>
							Prev
						</button>
						<button
							onClick={() => setSelectedIndex(selectedIndex + 1)}
							className="bg-slate-700 font-semibold text-base text-white px-4 py-2 disabled:bg-slate-400 rounded"
							disabled={selectedIndex >= 2}>
							Next
						</button>
					</div>
				</div>
			</section>
		</>
	);
};

export default TwoColumn;
