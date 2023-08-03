import { Driver, Location, TimeWindow } from "@/types";
import { convertTime } from "@/utils/timeHandlers";
import { FC } from "react";
import EntryMenu from "../menus/EntryMenu";

interface IProps {
	driver: Driver;
	onEdit: () => void;
}

/**
 * Card component that displays a driver's information.
 * @param driver The driver to display.
 * @param onEdit Callback function to handle when the user clicks the edit button.
 */

const DriverListingCard: FC<IProps> = ({ driver, onEdit }) => {
	return (
		<div className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100 flex justify-between items-center ">
			<span className="w-10/12">
				<h2 className="text-slate-800 font-bold">{driver.name}</h2>
				<h3 className="text-sm text-slate-800/80 font-medium">{driver.address}</h3>
				<div className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
					<p>{driver.break_slots.length} break(s)</p>
					<span>&middot;</span>
					<p>{driver.max_travel_time} min max travel</p>
					<span>&middot;</span>
					<p>{driver.max_stops} stops max</p>
				</div>{" "}
				<p className="mt-1 flex space-x-1 text-xs font-lg leading-4 text-gray-500">
					Shift from {convertTime(driver.time_window.startTime)} - {convertTime(driver.time_window.endTime)}
				</p>
			</span>
			<EntryMenu editCallback={onEdit} />
		</div>
	);
};

export default DriverListingCard;
