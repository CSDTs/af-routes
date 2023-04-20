import L, { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useRouteStore } from "../../store";

import CarMarker from "../atoms/map/CarMarker";
import CustomMarker from "../atoms/map/CustomMarker";

const RoutingMap = () => {
	const drivers = useRouteStore((state) => state.drivers);
	const locations = useRouteStore((state) => state.locations);
	const mapRef = useRef<any>(null);

	const [geojsonData, setGeojsonData] = useState<any>();
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
	}, [locations, drivers]);

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
				drivers.map((drivers) => (
					<CarMarker
						position={[drivers.coordinates?.latitude as number, drivers.coordinates?.longitude as number]}
						name={drivers.address}
						key={drivers.address}
					/>
				))}
			{geojsonData && <GeoJSON data={geojsonData} />}
		</MapContainer>
	);
};

export default RoutingMap;
