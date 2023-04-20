import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

interface MarkerProps {
	position: [number, number];
	name: string;
}

const CustomMarker = ({ position, name }: MarkerProps) => {
	const getRandomColor = (str: string) => {
		const hash = str.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
		let color = "#" + Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16);
		if (color.length < 7) color = `${color}0`;
		return color;
	};

	const color = getRandomColor(name);

	const markerHtmlStyles = `
        background-color: ${color};
        width: 2rem;
        height: 2rem;
        display: block;
        left: -0.5rem;
        top: -0.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`;

	const icon = L.divIcon({
		className: "my-custom-pin",
		iconAnchor: [0, 24],
		popupAnchor: [0, -36],
		html: `<span style="${markerHtmlStyles}" />`,
	});

	return (
		<Marker position={position} icon={icon}>
			<Popup>{name}</Popup>
		</Marker>
	);
};
export default CustomMarker;
