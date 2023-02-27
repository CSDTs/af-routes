import Header from "../components/base/Header";
import Subheader from "../components/base/Subheader";
import ListingHeader from "../components/listings/ListingHeader";
import ListingUnorderedList from "../components/listings/ListingUnorderedList";

export default function Destinations({ locations, setLocations }) {
	return (
		<>
			<Header>Destinations</Header>
			<Subheader>Fill in the table below to start adding destinations.</Subheader>

			<ul className="my-6">
				{locations.length > 0 &&
					locations[0].address != "" &&
					locations.map((listing, idx) => (
						<li key={listing.address} className="odd:bg-slate-300 even:bg-slate-100 p-3 m-1 font-medium">
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
		</>
	);
}
