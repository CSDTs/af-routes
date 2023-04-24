import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import ListingHeader from "../atoms/listings/ListingHeader";

import ListingUnorderedList from "../atoms/listings/ListingUnorderedList";
import { LocationTable } from "../molecules";

const DestinationsTab = () => {
	const locations = useRouteStore((state) => state.locations);

	return (
		<>
			<Header>Destinations</Header>
			<Subheader>Fill in the table below to start adding destinations.</Subheader>

			<LocationTable dataKey={"locations"} />
			{locations.length == 0 && (
				<div className="flex items-center mt-5 text-center border aspect-square bg-slate-100 border-slate-300">
					<p className="mx-auto my-auto">You don't have any destinations selected.</p>
				</div>
			)}

			{locations.length !== 0 && (
				<div className="flex my-6 overflow-y-auto text-center aspect-square ">
					<ul className="w-full ">
						{locations.length > 0 &&
							locations[0]?.address != "" &&
							locations.map((listing, idx) => (
								<li key={idx} className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100">
									<ListingHeader>{listing.address}</ListingHeader>
									<ListingUnorderedList>
										<li>
											{listing.coordinates?.latitude || ""}, {listing.coordinates?.longitude || ""}
										</li>
										<li>&middot;</li>
										<li>{listing.drop_off_duration} minutes</li>
										<li>&middot;</li>
										<li>{listing.priority ? "High" : "Normal"} priority</li>
									</ListingUnorderedList>
								</li>
							))}{" "}
					</ul>
				</div>
			)}
		</>
	);
};

export default DestinationsTab;
