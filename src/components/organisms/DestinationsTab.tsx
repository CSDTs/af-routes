import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import ListingHeader from "../atoms/listings/ListingHeader";

import { Location, TimeWindow } from "@/types";
import { convertTime } from "@/utils/timeHandlers";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useCallback, useState } from "react";
import FileUpload from "../atoms/inputs/FileUpload";
import ListingUnorderedList from "../atoms/listings/ListingUnorderedList";
import { LocationTable } from "../molecules";
import EditRoute from "../molecules/EditRoute";
import EntryMenu from "../molecules/EntryMenu";

const DestinationsTab = () => {
	const locations = useRouteStore((state) => state.locations);
	const [editStop, setEditStop] = useState(false);
	const [current, setCurrent] = useState<Location | null>(null);

	return (
		<>
			{/* <Header>Destinations</Header> */}
			{/* <Subheader>Fill in the table below to start adding destinations.</Subheader> */}

			<LocationTable dataKey={"locations"} />
			{locations.length == 0 && <FileUpload dataType="stop" />}

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
