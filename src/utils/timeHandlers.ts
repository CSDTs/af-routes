// Convert time string from 24hr to 12hr
export const convertTime = (time: string) => {
	const [hours, minutes] = time.split(":");
	return `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? "PM" : "AM"}`;
};
