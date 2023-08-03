import { useMenuStore, useRouteStore } from "@/store";
import { Driver } from "@/types";
import { getColor } from "@/utils/getColor";
import L from "leaflet";
import { FC, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { ImTruck } from "react-icons/im";
import { Marker, Popup, useMapEvents } from "react-leaflet";

import RightClickMenu from "./RightClickMenu";

const TruckIcon = (idx: number) => {
	const textColorClass = getColor(idx).text;

	return L.divIcon({
		className: "my-custom-pin",
		iconAnchor: [0, 24],
		popupAnchor: [0, -36],
		html: ReactDOMServer.renderToString(
			<span
				className={`text-red w-[2rem] h-[2rem] block -left-[0.5rem] -top-[0.5rem] relative  ${textColorClass} shadow-lg`}
				// style={{ color: color }}
			>
				<ImTruck className={`w-full h-full `} />{" "}
			</span>
		),
	});
};

interface IProps {
	position: { lat: number; lng: number };
	driverObject: any;
	setCurrent: (driver: Driver) => void;
	setEditDriver: (editStop: boolean) => void;
	setViewDriver: (viewStop: boolean) => void;
}
const DriverMarker: FC<IProps> = ({ position, driverObject, setCurrent, setEditDriver, setViewDriver }) => {
	const contextMenuRef = useRef<any>(null);
	const drivers = useRouteStore((state) => state.drivers);
	const icon = TruckIcon(driverObject?.id || 2);
	const map = useMapEvents({
		click(e) {
			e.originalEvent.preventDefault();

			// Really hacky way to avoid menu closure in case of clicking on the menu itself
			if (
				e.originalEvent.target instanceof HTMLDivElement &&
				e.originalEvent.target.classList.contains("leaflet-container")
			) {
				map.dragging.enable();
				closeMenuInStore();
			}
		},

		mousedown(e) {
			if (
				e.originalEvent.target instanceof HTMLDivElement &&
				e.originalEvent.target.classList.contains("leaflet-container")
			) {
				map.dragging.enable();
				closeMenuInStore();
			}
		},
	});

	const {
		openMenu,
		closeMenu: closeMenuInStore,
		menuPosition,
		showMenu,
		setActiveDriver,
		activeDriver,
	} = useMenuStore();
	const closeMenu = (e?: MouseEvent) => {
		if (contextMenuRef.current && (!e || !contextMenuRef.current.contains(e.target as Node))) {
			closeMenuInStore();
		}
	};

	const handleRightClick = (event: any) => {
		event.originalEvent.preventDefault();
		map.dragging.disable();
		const containerPoint = map.latLngToContainerPoint(event.latlng);
		closeMenu(); // Close any existing menu
		openMenu(containerPoint);

		console.log(activeDriver); // Open the new menu
	};

	const handleDelete = () => {
		console.log("Delete");
	};

	const handleEdit = () => {
		setCurrent(drivers.find((loc) => loc.id === activeDriver) as Driver);
		setEditDriver(true);

		closeMenuInStore();
	};

	const handleView = () => {
		setCurrent(drivers.find((loc) => loc.id === activeDriver) as Driver);
		setViewDriver(true);

		closeMenuInStore();
	};

	return (
		<>
			<div onContextMenu={handleRightClick} className="z-100">
				<Marker
					position={position}
					icon={icon}
					eventHandlers={{
						contextmenu: (event) => {
							event.originalEvent.preventDefault();
							handleRightClick(event);
							setActiveDriver(driverObject.id);
							setCurrent(driverObject);
						},
					}}>
					<Popup>
						{driverObject?.address} {driverObject?.id}
					</Popup>
				</Marker>
			</div>
			{showMenu && (
				<div ref={contextMenuRef} className="z-100">
					<RightClickMenu
						onDelete={handleDelete}
						onEdit={handleEdit}
						onView={handleView}
						position={menuPosition}
						data={activeDriver}
					/>
				</div>
			)}
		</>
	);
};

export default DriverMarker;
