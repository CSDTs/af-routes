import { useEffect, useRef, useState } from "react";
function filterObjectsWithKeys(objects, keys) {
	return objects.filter((obj) => {
		return keys.every((key) => {
			return obj.hasOwnProperty(key) && obj[key];
		});
	});
}
interface Address {
	displayName: string;
	lat: number;
	lon: number;
}

interface TableRow {
	address: string;
	duration: number;
	timeWindow: string;
	priority: string;
	coordinates: Object;
	breakSlots: string;
	maxStops: number;
}
const useTable = (mainData: any, initData: any) => {
	const [data, setData] = useState<Array<any>>(mainData);
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (mainData.length == 0) setData([...mainData, ...initData]);
	}, [mainData]);
	useEffect(() => {
		if (addresses.length > 0) {
			document.addEventListener("click", handleClickOutside);
			return () => {
				document.removeEventListener("click", handleClickOutside);
			};
		}
	}, [addresses]);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const addRow = (initData) => {
		setData([...data, initData]);
	};
	const removeRow = (index: number) => {
		const newRows = [...data];
		newRows.splice(index, 1);
		setData(newRows);
	};
	const deleteTableRows = (idx: number) => {
		const modifiedData = [...data];
		modifiedData.splice(idx, 1);
		setData(modifiedData);
	};

	const updateRowDataByEvent = (idx: number, e: Event) => {
		const { name, value } = e.target as HTMLButtonElement;
		const modifiedData = [...data];
		modifiedData[idx][name] = value;
		setData(modifiedData);
	};

	const updateRowDataByValue = (idx: number, key: string, value: any) => {
		const modifiedData = [...data];
		modifiedData[idx][key] = value;
		setData(modifiedData);
	};

	const populateFromDatabase = (dataSet: any) => {
		setData(dataSet);
	};

	const validateTableInformation = (required: string[]) => {
		if (required) {
			// const responses = data.filter((row) => row.address != "");

			const filteredData = filterObjectsWithKeys(data, required);
			console.log("Validating...");
			console.log(filteredData);
		}
	};
	const handleClickOutside = () => {
		setAddresses([]);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, key: keyof TableRow) => {
		const newRows = [...data];
		newRows[index][key] = event.target.value;
		setData(newRows);

		if (key === "address" && event.target.value !== "") {
			setLoading(true);

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(async () => {
				const url = `https://nominatim.openstreetmap.org/search?q=${event.target.value}%United%20States&format=json`;

				const response = await fetch(url);
				const data = await response.json();

				setAddresses(
					data.map((result: any) => ({
						displayName: result.display_name,
						lat: parseFloat(result.lat),
						lon: parseFloat(result.lon),
					}))
				);
				setLoading(false);
			}, 500);
		}

		if (key === "address" && event.target.value === "") {
			setAddresses([]);
		}
	};

	const handleSelect = (address: Address, index: number) => {
		const newRows = [...data];
		newRows[index].address = address.displayName;

		newRows[index]["coordinates"] = { latitude: address.lat, longitude: address.lon };
		setData(newRows);
		setAddresses([]);
	};
	return {
		addRow,
		deleteTableRows,
		updateRowDataByEvent,
		updateRowDataByValue,
		populateFromDatabase,
		validateTableInformation,
		data,
		setData,
		handleChange,
		handleSelect,
		handleClickOutside,
		addresses,
		loading,
		removeRow,
	};
};

export default useTable;
