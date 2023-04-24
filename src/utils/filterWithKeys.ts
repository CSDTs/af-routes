function filterObjectsWithKeys(objects: any[], keys: any[]) {
	return objects.filter((obj) => {
		return keys.every((key) => {
			return obj.hasOwnProperty(key) && obj[key];
		});
	});
}

export default filterObjectsWithKeys;
