import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import ListingHeader from "../atoms/listings/ListingHeader";

import { Location, TimeWindow } from "@/types";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import ListingUnorderedList from "../atoms/listings/ListingUnorderedList";
import { LocationTable } from "../molecules";
import EditRoute from "../molecules/EditRoute";
import EntryMenu from "../molecules/EntryMenu";

// Convert time string from 24hr to 12hr
const convertTime = (time: string) => {
	const [hours, minutes] = time.split(":");
	return `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? "PM" : "AM"}`;
};
const DestinationsTab = () => {
	const locations = useRouteStore((state) => state.locations);
	const [editStop, setEditStop] = useState(false);
	const [current, setCurrent] = useState<Location | null>(null);

	return (
		<>
			{/* <Header>Destinations</Header> */}
			{/* <Subheader>Fill in the table below to start adding destinations.</Subheader> */}

			<LocationTable dataKey={"locations"} />
			{locations.length == 0 && (
				<div className=" py-5 text-center border-4  bg-slate-100 border-slate-300 h-1/2  items-center flex flex-col justify-center border-dashed ">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-16 h-16 text-slate-500">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
						/>
					</svg>

					<h3 className="font-bold text-2xl mt-2 text-slate-700">Upload Stops</h3>
					<p className="mx-auto  p-3 text-slate-600">
						You don't have any stops yet. Upload a CSV to import them. Click{" "}
						<a href="/stops.csv" download className="text-blue-500 font-semibold">
							here
						</a>{" "}
						for an example. You can also add a stop with quick values above.{" "}
					</p>
				</div>
			)}

			{current && current.address && <EditRoute open={editStop} setOpen={setEditStop} stop={current} />}

			{locations.length !== 0 && (
				<div className="flex overflow-y-auto text-center h-full my-5">
					<section className="w-full ">
						{locations.length > 0 &&
							locations[0]?.address != "" &&
							locations.map((listing, idx) => (
								<div
									key={idx}
									className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100 flex justify-between items-center ">
									<span className="w-10/12">
										<h2 className="text-slate-800 font-bold">{listing.customer_name}</h2>
										<h3 className="text-sm text-slate-800/80 font-medium">{listing.address}</h3>
										{/* <ListingHeader>{listing.address}</ListingHeader> */}
										<ListingUnorderedList>
											<>
												<span className="font-semibold">{listing.drop_off_duration}</span> min
											</>
											<>&middot;</>
											<>{listing.priority > 50 ? "High" : "Normal"} priority</>
										</ListingUnorderedList>{" "}
										<p className="text-xs text-slate-700 mt-2">
											{listing.time_windows.map((tw: TimeWindow, idx: number) => (
												<span key={idx}>
													{convertTime(tw.startTime)} - {convertTime(tw.endTime)}
													{idx !== listing.time_windows.length - 1 && <>&#44; </>}
												</span>
											))}
										</p>
									</span>
									<EntryMenu
										editCallback={() => {
											const temp = locations.filter((loc) => loc.id == listing.id)[0];

											setCurrent(temp);
											setEditStop(true);
										}}
									/>
								</div>
							))}{" "}
					</section>
				</div>
			)}
		</>
	);
};

export default DestinationsTab;
