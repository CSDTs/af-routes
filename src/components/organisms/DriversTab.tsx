import { Break, Driver } from "@/types";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import ListingHeader from "../atoms/listings/ListingHeader";
import ListingSubheader from "../atoms/listings/ListingSubheader";
import ListingUnorderedList from "../atoms/listings/ListingUnorderedList";
import EditDriver from "../molecules/EditDriver";
import EntryMenu from "../molecules/EntryMenu";
import DriverTable from "../molecules/tables/DriverTable";
const convertTime = (time: string) => {
	const [hours, minutes] = time.split(":");
	return `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? "PM" : "AM"}`;
};
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
										<h2 className="text-slate-800 font-bold">{driver.name}</h2>
										<h3 className="text-sm text-slate-800/80 font-medium">{driver.address}</h3>
										{/* <ListingHeader>{driver.name}</ListingHeader>
										<ListingSubheader>{driver.address}</ListingSubheader> */}
										<ListingUnorderedList>
											<>{driver.break_slots.length} break(s)</>
											<>&middot;</>
											<>{driver.max_travel_time} min max travel</>
											<>&middot;</>
											<>{driver.max_stops} stops max</>
											<>&middot;</>
											<>
												Shift from {convertTime(driver.time_window.startTime)} -{" "}
												{convertTime(driver.time_window.endTime)}
											</>
										</ListingUnorderedList>{" "}
									</span>
									<EntryMenu
										editCallback={() => {
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
