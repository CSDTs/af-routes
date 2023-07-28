import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import ListingHeader from "../atoms/listings/ListingHeader";
import ListingSubheader from "../atoms/listings/ListingSubheader";
import ListingUnorderedList from "../atoms/listings/ListingUnorderedList";

import DriverTable from "../molecules/tables/DriverTable";
const DriversTab = () => {
	const drivers = useRouteStore((state) => state.drivers);

	return (
		<>
			{/* <Header>Drivers</Header>
			<Subheader>Fill in the table below to start adding drivers to map.</Subheader> */}

			<DriverTable dataKey={"drivers"} />

			{drivers.length == 0 && (
				// <div className="flex items-center mt-5 text-center border h-96 bg-slate-100 border-slate-300">
				<p className="mx-auto my-auto p-3">You don't have any drivers added.</p>
				// </div>
			)}

			{drivers.length !== 0 && (
				<div className="flex overflow-y-auto text-center h-full my-5">
					<ul className="w-full ">
						{drivers.length > 0 &&
							drivers[0]?.address != "" &&
							drivers.map((driver, idx) => (
								<li key={idx} className="px-3 py-2 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100">
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
										<li>&middot;</li>
										<>Shift from 09:00 to 17:00</>
									</ListingUnorderedList>
								</li>
							))}
					</ul>
				</div>
			)}
		</>
	);
};

export default DriversTab;
