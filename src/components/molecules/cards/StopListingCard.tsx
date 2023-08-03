import { Location, TimeWindow } from "@/types";
import { convertTime } from "@/utils/timeHandlers";
import { FC } from "react";
import EntryMenu from "../menus/EntryMenu";

interface IProps {
	stop: Location;
	onEdit: () => void;
}

/**
 * Card component that displays a stop's information.
 * @param stop The stop to display.
 * @param onEdit Callback function to handle when the user clicks the edit button.
 */

const StopListingCard: FC<IProps> = ({ stop, onEdit }) => {
	return (
		<div className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100 flex justify-between items-center ">
			<span className="w-10/12">
				<h2 className="text-slate-800 font-bold">{stop.customer_name}</h2>
				<h3 className="text-sm text-slate-800/80 font-medium">{stop.address}</h3>
				<div className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
					<p>
						<span className="font-semibold">{stop.drop_off_duration}</span> min
					</p>
					<span>&middot;</span>
					<p>{stop.priority > 50 ? "High" : "Normal"} priority</p>
				</div>
				<p className="text-xs text-slate-700 mt-2">
					{stop.time_windows.map((tw: TimeWindow, idx: number) => (
						<span key={idx}>
							{convertTime(tw.startTime)} - {convertTime(tw.endTime)}
							{idx !== stop.time_windows.length - 1 && <>&#44; </>}
						</span>
					))}
				</p>
			</span>
			<EntryMenu editCallback={onEdit} />
		</div>
	);
};

export default StopListingCard;
