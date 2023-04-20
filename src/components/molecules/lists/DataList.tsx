import { Driver, Location } from "../../../types";
import ListingHeader from "../../atoms/listings/ListingHeader";
import ListingSubheader from "../../atoms/listings/ListingSubheader";
import ListingUnorderedList from "../../atoms/listings/ListingUnorderedList";

type PropTypes = {
	dataType: string;
	data: Array<any>;
};

const DataList = ({ dataType, data }: PropTypes) => {
	if (dataType == "driver")
		return (
			<ul className="my-6">
				{data.length > 0 &&
					data[0]?.starting_address != "" &&
					data.map((driver, idx) => (
						<li key={idx} className="odd:bg-slate-300 even:bg-slate-100 py-2 px-3 m-1 font-medium">
							<ListingHeader>{driver.name}</ListingHeader>
							<ListingSubheader>{driver.address}</ListingSubheader>
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
		);

	if (dataType == "location") {
		return (
			<ul className="my-6">
				{data.length > 0 &&
					data[0]?.address != "" &&
					data.map((listing, idx) => (
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
		);
	}
	return (
		<>
			<p>Data type hasn't been defined yet...</p>
		</>
	);
};

export default DataList;
