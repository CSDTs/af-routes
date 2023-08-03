import { GeoSearchControl } from "leaflet-geosearch";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";

/**
 * Search component for the map allowing address lookup
 */
const MapSearch = (props: any) => {
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

export default MapSearch;
