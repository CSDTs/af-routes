const formatTime = (seconds: number): string => {
	const date = new Date(seconds * 1000);
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const amOrPm = hours >= 12 ? "PM" : "AM";
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
};
function convertHMS(timeString: string) {
	const arr: string[] = timeString.split(":");
	const seconds: number = parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60;
	return seconds;
}
export { formatTime };
