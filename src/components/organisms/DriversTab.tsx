import { Driver } from "@/types";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import ListingHeader from "../atoms/listings/ListingHeader";
import ListingSubheader from "../atoms/listings/ListingSubheader";
import ListingUnorderedList from "../atoms/listings/ListingUnorderedList";
import EditDriver from "../molecules/EditDriver";
import DriverTable from "../molecules/tables/DriverTable";
const DriversTab = () => {
	const drivers = useRouteStore((state) => state.drivers);
	const [editDriver, setEditDriver] = useState(false);
	const [current, setCurrent] = useState<Driver | null>(null);
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
			{current && current.address && <EditDriver open={editDriver} setOpen={setEditDriver} stop={current} />}
			{drivers.length !== 0 && (
				<div className="flex overflow-y-auto text-center h-full my-5">
					<section className="w-full ">
						{drivers.length > 0 &&
							drivers[0]?.address != "" &&
							drivers.map((driver, idx) => (
								<div
									key={idx}
									className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100 flex justify-between items-center ">
									<span>
										{" "}
										<ListingHeader>{driver.name}</ListingHeader>
										<ListingSubheader>{driver.address}</ListingSubheader>
										<ListingUnorderedList>
											<>
												{driver.coordinates?.latitude || ""}, {driver.coordinates?.longitude || ""}
											</>
											<>&middot;</>
											<>{driver.max_travel_time} minutes</>
											<>&middot;</>
											<>{driver.max_stops} stops</>
											<>&middot;</>
											<>Shift from 09:00 to 17:00</>
										</ListingUnorderedList>{" "}
									</span>
									<PencilIcon
										className="h-6 w-6"
										onClick={() => {
											const temp = drivers.filter((loc) => loc.id == driver.id)[0];

											setCurrent(temp);
											setEditDriver(true);
										}}
									/>
								</div>
							))}
					</section>
				</div>
			)}
		</>
	);
};

export default DriversTab;
