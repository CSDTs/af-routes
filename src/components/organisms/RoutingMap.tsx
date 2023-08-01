import CarMarker from "@/components/atoms/map/CarMarker";
import CustomMarker from "@/components/atoms/map/CustomMarker";
import { useRequestStore, useRouteStore } from "@/store";
import { getStyle } from "@/utils/getColor";
import getUniqueKey from "@/utils/getUniqueKey";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import L, { LatLngExpression } from "leaflet";
import { GeoSearchControl, GoogleProvider, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { Fragment, useEffect, useRef, useState } from "react";

import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
const ContextMenu = ({ x, y }) => {
	const mapRef = useRef(null);

	// Get the map container's offset
	const offsetX = mapRef.current ? mapRef.current.offsetLeft : -225;
	const offsetY = mapRef.current ? mapRef.current.offsetTop : 10;

	return (
		<div
			style={{ top: y - offsetY, left: x - offsetX }}
			className="z-50 fixed  w-56 h-auto flex text-lg font-semibold shadow-lg rounded p-2">
			{/* Display the context menu options here */}
			<div className="relative inline-block text-left">
				<section className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						<p className="text-base px-2 py-2">Lat, Lng</p>
					</div>
					<div className="px-1 py-1">
						{" "}
						<div>
							<button className="hover:bg-violet-500 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
								Edit
							</button>
						</div>
						<div>
							<button className="hover:bg-violet-500 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
								View
							</button>
						</div>
					</div>
					<div className="px-1 py-1">
						<div>
							<button className="hover:bg-violet-500 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
								Delete
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

const LocationPin = ({ onRightClick, handleMenuClose }) => {
	const [position, setPosition] = useState<any>(null);

	useMapEvents({
		dblclick(e) {
			setPosition(e.latlng);
		},
		click(e) {
			handleMenuClose();
		},
		drag(e) {
			handleMenuClose();
		},
	});

	return position === null ? null : (
		<Marker
			position={position}
			eventHandlers={{
				contextmenu: (event) => {
					event.originalEvent.preventDefault();
					onRightClick(event);
				},
			}}>
			<Popup>You are here</Popup>
		</Marker>
	);
};

// make new leaflet element

const Search = (props: any) => {
	const map = useMap();

	useEffect(() => {
		const searchControl = new (GeoSearchControl as any)({
			provider: props.provider,
			...props,
		});

		map.addControl(searchControl);
		return () => {
			map.removeControl(searchControl);
		};
	}, [props]);

	return null;
};

const RoutingMap = () => {
	const drivers = useRouteStore((state) => state.drivers);
	const locations = useRouteStore((state) => state.locations);
	const mapRef = useRef<any>(null);
	const optimization = useRequestStore((state) => state.optimization);
	const cachedOptimizations = useRequestStore((state) => state.cachedOptimizations);
	const [geojsonData, setGeojsonData] = useState<any>();
	const setOptimization = useRequestStore((state) => state.setOptimization);
	const [markers, setMarkers] = useState([]);
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

	const handleDoubleClick = (event) => {
		setMarkers([...markers, [event.latlng.lat, event.latlng.lng]]);
	};
	//Recalculate the bounds of the current map
	useEffect(() => {
		if (((locations && locations.length > 0) || (drivers && drivers.length > 0)) && mapRef.current) {
			const bounds = L.latLngBounds(
				[...locations, ...drivers].map(
					(location) => [location?.coordinates?.latitude, location?.coordinates?.longitude] as LatLngExpression
				)
			);
			mapRef.current.fitBounds(bounds);
		}
		setGeojsonData(null);
		setOptimization(null);
	}, [locations, drivers]);

	//Update displayed geometry from optimization request
	useEffect(() => {
		if (optimization)
			getUniqueKey({ locations, drivers }).then((data) => {
				setGeojsonData(cachedOptimizations.get(data)?.geometry);
			});
	}, [optimization]);

	const handleRightClick = (event) => {
		setContextMenu({
			visible: true,
			x: event.originalEvent.pageX,
			y: event.originalEvent.pageY,
		});
	};

	return (
		<div className="relative z-0">
			{" "}
			{contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} />}
			<MapContainer
				ref={mapRef}
				center={[42.279594, -83.732124]}
				zoom={15}
				style={{ zIndex: -1 }}
				doubleClickZoom={false}
				maxBounds={[
					[40.70462625, -91.6624658],
					[49.29755475, -80.8782742],
				]}
				minZoom={6.5}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
				/>
				{locations &&
					locations.length > 0 &&
					locations.map((location) => (
						<CustomMarker
							position={[location.coordinates?.latitude as number, location.coordinates?.longitude as number]}
							name={location?.address}
							key={location?.address}
						/>
					))}
				{drivers &&
					drivers.length > 0 &&
					drivers.map((vehicle) => (
						<CarMarker
							position={[vehicle.coordinates?.latitude as number, vehicle.coordinates?.longitude as number]}
							name={vehicle.address}
							vehicle={vehicle}
							key={vehicle.address}
						/>
					))}{" "}
				<LocationPin
					onRightClick={handleRightClick}
					handleMenuClose={() => {
						setContextMenu({
							visible: false,
						});
					}}
				/>{" "}
				<Search provider={new GoogleProvider({ apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY })} />
				{geojsonData && <GeoJSON data={geojsonData} style={getStyle} />}
			</MapContainer>
		</div>
	);
};

export default RoutingMap;
