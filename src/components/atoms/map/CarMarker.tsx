import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { ImTruck } from "react-icons/im";
import { Marker, Popup } from "react-leaflet";
import { Driver } from "../../../types";

interface MarkerProps {
	position: [number, number];
	name: string;
	vehicle: Driver;
}

// const getRandomColor = (str: string) => {
// 	// Calculate the hash from the input string
// 	const hash = str.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);

// 	// Generate the color string from the hash
// 	let color = "#" + Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16);

// 	// Check if the color is too light and if so, darken it
// 	const brightnessThreshold = 130; // Increase this value for darker colors
// 	const brightness =
// 		0.299 * parseInt(color.substr(1, 2), 16) +
// 		0.587 * parseInt(color.substr(3, 2), 16) +
// 		0.114 * parseInt(color.substr(5, 2), 16);
// 	if (brightness > brightnessThreshold) {
// 		const brightnessDifference = brightness - brightnessThreshold;
// 		color = color.replace(/^#/, "");
// 		const rgb = color.match(/.{2}/g).map((c) => parseInt(c, 16));
// 		const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
// 		const newL = Math.max(hsl[2] - brightnessDifference / 255, 0);
// 		const newRgb = hslToRgb(hsl[0], hsl[1], newL);
// 		color = `#${newRgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
// 	}

// 	return color;
// };

// // Helper functions for converting RGB to HSL and back
// function rgbToHsl(r: number, g: number, b: number) {
// 	(r /= 255), (g /= 255), (b /= 255);
// 	const max = Math.max(r, g, b),
// 		min = Math.min(r, g, b);
// 	let h,
// 		s,
// 		l = (max + min) / 2;
// 	if (max == min) h = s = 0;
// 	else {
// 		const d = max - min;
// 		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
// 		switch (max) {
// 			case r:
// 				h = (g - b) / d + (g < b ? 6 : 0);
// 				break;
// 			case g:
// 				h = (b - r) / d + 2;
// 				break;
// 			case b:
// 				h = (r - g) / d + 4;
// 				break;
// 		}
// 		h /= 6;
// 	}
// 	return [h, s, l];
// }

// function hslToRgb(h: number, s: number, l: number) {
// 	let r, g, b;
// 	if (s == 0) r = g = b = l;
// 	else {
// 		const hue2rgb = (p: number, q: number, t: number) => {
// 			if (t < 0) t += 1;
// 			if (t > 1) t -= 1;
// 			if (t < 1 / 6) return p + (q - p) * 6 * t;
// 			if (t < 1 / 2) return q;
// 			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
// 			return p;
// 		};
// 		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
// 		const p = 2 * l - q;
// 		r = hue2rgb(p, q, h + 1 / 3);
// 		g = hue2rgb(p, q, h);
// 		b = hue2rgb(p, q, h - 1 / 3);
// 	}
// 	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
// }

const getRandomColor = (str: string) => {
	const hash = str.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
	let color = "#" + Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16);
	if (color.length < 7) color = `${color}0`;
	return color;
};
const TruckIcon = (idx: number) => {
	const color = getRandomColor(idx.toString());

	const colors = ["text-red-700", "text-blue-700", "text-green-700", "text-purple-700", "text-teal-400"];
	const hexColors = ["#b91c1c", "#1d4ed8", "#15803d", "#7e22ce", "#334155"];
	const colorIndex = idx % colors.length;
	const textColorClass = colors[colorIndex];

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
const CarMarker = ({ position, vehicle }: MarkerProps) => {
	// const getRandomColor = (str: string) => {
	// 	const hash = str.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
	// 	let color = "#" + Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16);
	// 	if (color.length < 7) color = `${color}0`;
	// 	return color;
	// };

	// const color = getRandomColor(name);

	const pain = ` w-[2rem] h-[2rem] block -left-[0.5rem] -top-[0.5rem] relative `;

	// const markerHtmlStyles = `
	//     color: ${color};
	//     width: 2rem;
	//     height: 2rem;
	//     display: block;
	//     left: -0.5rem;
	//     top: -0.5rem;
	//     position: relative;
	//     border-radius: 3rem 3rem 0;
	//     // transform: rotate(45deg);
	//     // border: 1px solid #FFFFFF`;

	// const icon = L.divIcon({
	// 	className: "my-custom-pin",
	// 	iconAnchor: [0, 24],
	// 	popupAnchor: [0, -36],
	// 	html: ReactDOMServer.renderToString(
	// 		<span
	// 			className={` w-[2rem] h-[2rem] block -left-[0.5rem] -top-[0.5rem] relative  text-blue-${"8"}00`}
	// 			// style={{ color: color }}
	// 		>
	// 			<ImTruck className={`w-full h-full `} />{" "}
	// 		</span>
	// 	),
	// });

	const icon = TruckIcon(vehicle.id);
	return (
		<Marker position={position} icon={icon}>
			<Popup>
				<div className="flex flex-col">
					<span>{vehicle.name}</span>
					<span>{vehicle.address}</span>
				</div>
			</Popup>
		</Marker>
	);
};
export default CarMarker;
