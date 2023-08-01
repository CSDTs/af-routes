import { useState } from "react";

import locationData from "../../../data/addresses.json";

import { uniqueId } from "lodash";
import { useModalWithData } from "../../../hooks/useModal";
import useTable from "../../../hooks/useTable";
import { useRouteStore } from "../../../store";

import { CloseBtn, Modal, PrimaryBtn, SecondaryBtn } from "../../atoms/";
import LoadingIndicator from "../../atoms/indicators/LoadingIndicator";

import * as Papa from "papaparse";
import AddRoute from "../AddRoute";
import SlideOver from "../SlideOver";
interface TableProps {
	dataKey: string;
}
const LocationTable = ({ dataKey }: TableProps) => {
	const { modalOpen, setModalState } = useModalWithData();

	const [createStop, setCreateStop] = useState(false);
	const [createNewStop, setCreateNewStop] = useState(false);
	const currentLocations = useRouteStore((state) => state[dataKey]);
	const setData = useRouteStore((state) => state.setData);

	const [current, setCurrent] = useState(0);
	const initData = {
		address: "",
		drop_off_duration: 0,
		time_windows: [["00:00", "00:00"]],
		priority: 1,
		coordinates: {},
		timeWindowStart: "",
		timeWindowEnd: "",
	};

	const tableHook = useTable(currentLocations, [initData]);
	const [value, onChange] = useState(new Date());
	const closeModal = () => {
		const filteredData = tableHook.data.filter((data) => {
			return data.address !== "";
		});
		if (filteredData) {
			setData(dataKey, filteredData);
		}
		setModalState(false);
	};
	const populateFromDatabase = () => {
		const data = locationData.map((location) => {
			return {
				...location,
				id: parseInt(uniqueId()),
			};
		});
		tableHook.setData(data);
		setData(dataKey, data);
	};

	const handleCSVUpload = (event: any) => {
		const file = event.target.files[0];
		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: (results) => {
				// Transform the data into the expected format
				const parsedData = results.data.map((row: any, index) => ({
					id: parseInt(uniqueId()),
					address: row.address.replace(/\\,/g, ","),
					drop_off_duration: row.drop_off_duration,
					time_windows: [[row.time_window_start, row.time_window_end]],
					priority: row.priority,
					coordinates: { latitude: row.latitude, longitude: row.longitude },
				}));

				// Update the table and store with the parsed data
				tableHook.setData(parsedData);
				setData(dataKey, parsedData);
			},
		});
	};

	return (
		<>
			<div className="flex items-center justify-center gap-4 mx-auto bg-white w-full p-3 shadow my-2">
				<PrimaryBtn clickHandler={() => setCreateNewStop(true)}>Add Stop</PrimaryBtn>
				<SecondaryBtn clickHandler={populateFromDatabase}>Autofill</SecondaryBtn>
				<label className="cursor-pointer flex w-full text-center">
					<span className="rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full cursor-pointer">
						Upload...
					</span>
					<input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
				</label>
			</div>
			<AddRoute open={createNewStop} setOpen={setCreateNewStop} />
		</>
	);
};
export default LocationTable;
