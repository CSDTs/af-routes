import L from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
const center = [51.505, -0.09];
const zoom = 13;
function DisplayPosition({ map, position, setPosition }) {
	// const [position, setPosition] = useState(() => map.getCenter());
	if (map.current === null) return null;
	const onClick = useCallback(() => {
		map.current.setView(center, zoom);
	}, [map]);

	const onMove = useCallback(() => {
		setPosition(map.current.getCenter());
	}, [map]);

	useEffect(() => {
		map.current.on("move", onMove);
		return () => {
			map.current.off("move", onMove);
		};
	}, [map, onMove]);

	return (
		<p>
			latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)} <button onClick={onClick}>reset</button>
		</p>
	);
}

function ExternalStateExample() {
	const map = useRef<any>(null);

	const [position, setPosition] = useState();

	useEffect(() => {
		if (map.current != null) setPosition(() => map?.current?.getCenter());
	}, [map.current]);

	return (
		<div>
			<DisplayPosition map={map} position={position} setPosition={setPosition} />
			<MapContainer center={center} zoom={zoom} scrollWheelZoom={false} ref={map}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
			</MapContainer>
		</div>
	);
}

export default ExternalStateExample;
