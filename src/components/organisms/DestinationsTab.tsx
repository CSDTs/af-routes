import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import ListingHeader from "../atoms/listings/ListingHeader";

import ListingUnorderedList from "../atoms/listings/ListingUnorderedList";
import { LocationTable } from "../molecules";

const DestinationsTab = () => {
	const locations = useRouteStore((state) => state.locations);

	return (
		<>
			{/* <Header>Destinations</Header> */}
			{/* <Subheader>Fill in the table below to start adding destinations.</Subheader> */}

			<LocationTable dataKey={"locations"} />
			{locations.length == 0 && (
				// <div className=" items-stretch py-5 text-center border flex flex-col bg-slate-100 border-slate-300 h-5/6 mt-auto">
				<p className="mx-auto my-auto p-3 ">You don't have any destinations selected.</p>
				// </div>
			)}

			{locations.length !== 0 && (
				<div className="flex overflow-y-auto text-center h-full my-5">
					<section className="w-full ">
						{locations.length > 0 &&
							locations[0]?.address != "" &&
							locations.map((listing, idx) => (
								<div
									key={idx}
									className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100 flex justify-between items-center ">
									<span>
										<ListingHeader>{listing.address}</ListingHeader>
										<ListingUnorderedList>
											<>
												{listing.coordinates?.latitude || ""}, {listing.coordinates?.longitude || ""}
											</>
											<>&middot;</>
											<>{listing.drop_off_duration} minutes</>
											<>&middot;</>
											<>{listing.priority ? "High" : "Normal"} priority</>
										</ListingUnorderedList>
									</span>

									<ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
								</div>
							))}{" "}
					</section>
				</div>
			)}
		</>
	);
};

export default DestinationsTab;
