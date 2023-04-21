import L, { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useRequestStore, useRouteStore } from "../../store";

import CarMarker from "../atoms/map/CarMarker";
import CustomMarker from "../atoms/map/CustomMarker";
const getUniqueKey = async (obj: Object) => {
	// Convert the object to a string using JSON.stringify
	const objString = JSON.stringify(obj);

	// Hash the string using a hash function (here, we use the built-in SHA-256 algorithm)
	const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(objString));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

	// Return the hashed string as the unique key
	return hashHex;
};
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

	useEffect(() => {
		if (optimization)
			getUniqueKey({ locations, drivers }).then((data) => {
				setGeojsonData(cachedOptimizations.get(data)?.geometry);
			});
	}, [optimization]);
	function style(feature) {
		const hexColors = ["#b91c1c", "#1d4ed8", "#15803d", "#7e22ce", "#22d3ee"];
		const colorIndex = feature.geometry.properties.color % hexColors.length;
		const textColorClass = hexColors[colorIndex];
		return {
			fillColor: "transparent",
			weight: 2,
			opacity: 1,
			color: textColorClass, //Outline color
			fillOpacity: 1,
		};
	}
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
			{geojsonData && <GeoJSON data={geojsonData} style={style} />}
		</MapContainer>
	);
};

export default RoutingMap;
