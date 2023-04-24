const getColor = (id: number) => {
	const colors = ["border-red-700", "border-blue-700", "border-green-700", "border-purple-700", "border-teal-400"];
	const hexColors = ["#b91c1c", "#1d4ed8", "#15803d", "#7e22ce", "#2dd4bf"];
	const shadowColors = [
		"shadow-red-700",
		"shadow-blue-700",
		"shadow-green-700",
		"shadow-purple-700",
		"shadow-teal-400",
	];

	return {
		border: colors[id % colors.length],
		shadow: shadowColors[id % colors.length],
		fill: hexColors[id % hexColors.length],
	};
};

const getStyle = (feature: any) => {
	const textColorClass = getColor(feature.geometry.properties.color).fill;
	return {
		fillColor: "transparent",
		weight: 2,
		opacity: 1,
		color: textColorClass, //Outline color
		fillOpacity: 1,
	};
};
export { getColor, getStyle };
