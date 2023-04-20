/**
 * Generates a color based on a given string
 *
 * @param str Random string to be converted to a color
 * @returns a color based on the given string
 */
const getRandomColor = (str: string) => {
	const hash = str.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
	let color = "#" + Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16);
	if (color.length < 7) color = `${color}0`;
	return color;
};

export default getRandomColor;
