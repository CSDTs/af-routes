import { Driver } from "@/types";
import { getColor } from "@/utils/getColor";
import { divIcon } from "leaflet";
import ReactDOMServer from "react-dom/server";
import { ImTruck } from "react-icons/im";
import { Marker, Popup } from "react-leaflet";

interface MarkerProps {
	position: [number, number];
	name: string;
	vehicle?: Driver;
}

/**
 * Creates a custom icon for the truck marker with a given color
 */
const TruckIcon = (color: string) => {
	return divIcon({
		className: "my-custom-pin",
		iconAnchor: [0, 24],
		popupAnchor: [0, -36],
		html: ReactDOMServer.renderToString(
			<span
				className={` w-[2.5rem] h-[2.5rem] block -left-[0.5rem] -top-[0.5rem] relative ${color} shadow-lg bg-white rounded-lg p-1`}>
				<ImTruck className={`w-full h-full `} />
			</span>
		),
	});
};

/**
 * Creates a custom marker that looks like a truck for the driver entries on the map
 */
const CarMarker = ({ position, vehicle }: MarkerProps) => {
	const color = getColor(vehicle?.id || 2).text;
	const icon = TruckIcon(color);
	return (
		<Marker position={position} icon={icon}>
			<Popup>
				<div className="flex flex-col">
					<span>{vehicle?.name || "Driver"}</span>
					<span>{vehicle?.address || "Start and End Location"}</span>
				</div>
			</Popup>
		</Marker>
	);
};
export default CarMarker;
