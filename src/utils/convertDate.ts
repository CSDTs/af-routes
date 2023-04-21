const convertToEpoch = (date: string) => {
	return Date.parse(new Date(date).toString()).toString();
};

const convertToISO = (date: string) => {
	return new Date(date).toISOString().split(".")[0].toString();
};

const newISODate = () => {
	return new Date().toISOString().split(".")[0].toString();
};

const newEpochDate = () => {
	return Date.parse(new Date().toISOString().split(".")[0]).toString();
};
export { convertToEpoch, convertToISO, newEpochDate, newISODate };
