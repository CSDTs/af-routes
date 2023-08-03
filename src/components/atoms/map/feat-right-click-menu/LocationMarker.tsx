import { useRouteStore } from "@/store";
import { FC, useRef } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import RightClickMenu from "./RightClickMenu";

import { useMenuStore } from "@/store";

import { Location } from "@/types";

interface IProps {
	position: { lat: number; lng: number };
	locationObject: Location;
	setCurrent: (location: Location) => void;
	setEditStop: (editStop: boolean) => void;
	setViewStop: (viewStop: boolean) => void;
}

const LocationMarker: FC<IProps> = ({ position, locationObject, setCurrent, setEditStop, setViewStop }) => {
	const contextMenuRef = useRef<any>(null);
	const locations = useRouteStore((state) => state.locations);

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

	const { openMenu, closeMenu: closeMenuInStore, menuPosition, showMenu, setActiveItem, activeItem } = useMenuStore();
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

		console.log(activeItem); // Open the new menu
	};

	const handleDelete = () => {
		console.log("Delete");
	};

	const handleEdit = () => {
		setCurrent(locations.find((loc) => loc.id === activeItem) as Location);
		setEditStop(true);

		closeMenuInStore();
	};

	const handleView = () => {
		setCurrent(locations.find((loc) => loc.id === activeItem) as Location);
		setViewStop(true);

		closeMenuInStore();
	};

	return (
		<>
			<div onContextMenu={handleRightClick} className="z-100">
				<Marker
					position={position}
					eventHandlers={{
						contextmenu: (event) => {
							event.originalEvent.preventDefault();
							handleRightClick(event);
							setActiveItem(locationObject.id);
							setCurrent(locationObject);
						},
					}}>
					<Popup>
						{locationObject?.address} {locationObject?.id}
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
						data={activeItem}
					/>
				</div>
			)}
		</>
	);
};

export default LocationMarker;
