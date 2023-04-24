import { useRequestStore, useRouteStore } from "@/store";
import L, { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import CarMarker from "@/components/atoms/map/CarMarker";
import CustomMarker from "@/components/atoms/map/CustomMarker";
import { getStyle } from "@/utils/getColor";
import getUniqueKey from "@/utils/getUniqueKey";

const RoutingMap = () => {
	const drivers = useRouteStore((state) => state.drivers);
	const locations = useRouteStore((state) => state.locations);
	const mapRef = useRef<any>(null);
	const optimization = useRequestStore((state) => state.optimization);
	const cachedOptimizations = useRequestStore((state) => state.cachedOptimizations);
	const [geojsonData, setGeojsonData] = useState<any>();
	const setOptimization = useRequestStore((state) => state.setOptimization);

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

	return (
		<MapContainer ref={mapRef} center={[42.279594, -83.732124]} zoom={15}>
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
				))}
			{geojsonData && <GeoJSON data={geojsonData} style={getStyle} />}
		</MapContainer>
	);
};

export default RoutingMap;
