export const formatTime = (seconds: number): string => {
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

// convert seconds to minutes
export const convertMinutes = (seconds: number) => {
	let minutes = Math.floor(seconds / 60);
	return minutes;
};
export const convertTime = (seconds: number) => {
	let hours = Math.floor(seconds / 3600);
	let minutes = Math.floor((seconds % 3600) / 60);
	let ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	let minutesStr = minutes < 10 ? "0" + minutes : minutes;
	let strTime = hours + ":" + minutesStr + " " + ampm;
	return strTime;
};
