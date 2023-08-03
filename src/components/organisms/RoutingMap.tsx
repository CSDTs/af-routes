import CarMarker from "@/components/atoms/map/CarMarker";

import { useMenuStore, useRequestStore, useRouteStore } from "@/store";
import { getStyle } from "@/utils/getColor";
import getUniqueKey from "@/utils/getUniqueKey";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import L, { LatLngExpression } from "leaflet";
import { GeoSearchControl, GoogleProvider, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import MapSearch from "../atoms/map/MapSearch";
import StopMarker from "../atoms/map/StopMarker";

const RoutingMap = () => {
	const drivers = useRouteStore((state) => state.drivers);
	const locations = useRouteStore((state) => state.locations);
	const mapRef = useRef<any>(null);
	const optimization = useRequestStore((state) => state.optimization);
	const cachedOptimizations = useRequestStore((state) => state.cachedOptimizations);
	const [geojsonData, setGeojsonData] = useState<any>();
	const setOptimization = useRequestStore((state) => state.setOptimization);

	const [filteredLocations, setFilteredLocations] = useState<any>([]);

	const mapJobsToVehicles = useCallback((optimizationObjects: Array<any>) => {
		const result = [];
		for (const obj of optimizationObjects) {
			const vehicleId = obj.vehicle;
			for (const step of obj.steps) {
				if (step.type === "job" && step.id !== undefined) {
					const jobId = step.id;
					result.push({ job_id: jobId, vehicle_id: vehicleId });
				}
			}
		}
		return result;
	}, []);
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
		setFilteredLocations([]);
		if (optimization)
			getUniqueKey({ locations, drivers }).then((data) => {
				setFilteredLocations(mapJobsToVehicles(cachedOptimizations.get(data)?.data.routes));
				setGeojsonData(cachedOptimizations.get(data)?.geometry);
			});
	}, [optimization]);

	return (
		<>
			<div className="relative z-0">
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
							<StopMarker
								position={[location.coordinates?.latitude as number, location.coordinates?.longitude as number]}
								name={location?.address}
								key={location?.address}
								id={location.id}
								colorMapping={
									filteredLocations.find((item: { job_id: number; vehicle_id: number }) => location.id === item.job_id)
										?.vehicle_id
								}
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
					<MapSearch provider={new GoogleProvider({ apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY })} />
					{geojsonData && <GeoJSON data={geojsonData} style={getStyle} />}
				</MapContainer>
			</div>
		</>
	);
};

export default RoutingMap;
