import { FileUpload, ListingUnorderedList, PrimaryBtn, SecondaryBtn } from "@/components/atoms/";
import { AddDriver, EditDriver, EntryMenu } from "@/components/molecules";
import driverData from "@/data/drivers.json";
import { Driver } from "@/types";

import { uniqueId } from "lodash";
import * as Papa from "papaparse";
import { useState } from "react";
import { useRouteStore } from "../../store";

import { parseDriver } from "@/utils/parsingData";
import { convertTime } from "@/utils/timeHandlers";

const DriversTab = () => {
	const [createDriver, setCreateDriver] = useState(false);
	const drivers = useRouteStore((state) => state.drivers);
	const setDrivers = useRouteStore((state) => state.setDrivers);
	const [editDriver, setEditDriver] = useState(false);
	const [current, setCurrent] = useState<Driver | null>(null);

	const populateFromDatabase = () => {
		const data = driverData.map((driver) => {
			return {
				...driver,
				id: parseInt(uniqueId()),
				break_slots: driver.break_slots.map((slot) => {
					return {
						...slot,
						id: parseInt(uniqueId()),
					};
				}),
			};
		});

		setDrivers(data);
	};

	const handleCSVUpload = (event: any) => {
		const file = event.target.files[0];
		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: (results) => {
				// Transform the data into the expected format
				const parsedData = results.data.map((row: any) => parseDriver(row) as Driver);

				// Update the table and store with the parsed data
				setDrivers(parsedData);
			},
		});
	};
	return (
		<>
			<div className="flex items-center justify-center gap-4 mx-auto bg-white w-full p-3 shadow my-2">
				<PrimaryBtn clickHandler={() => setCreateDriver(true)}>Add Driver</PrimaryBtn>
				<SecondaryBtn clickHandler={populateFromDatabase}>Autofill</SecondaryBtn>
				<label className="cursor-pointer flex w-full text-center">
					<span className="rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full cursor-pointer">
						Upload...
					</span>
					<input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
				</label>
			</div>
			<AddDriver open={createDriver} setOpen={setCreateDriver} />

			{drivers.length == 0 && <FileUpload dataType="driver" />}

			{current && current.address && <EditDriver open={editDriver} setOpen={setEditDriver} stop={current} />}

			{drivers.length !== 0 && (
				<div className="flex overflow-y-auto text-center h-full my-5">
					<section className="w-full ">
						{drivers.length > 0 &&
							drivers[0]?.address != "" &&
							drivers.map((driver, idx) => (
								<div
									key={idx}
									className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100 flex justify-between items-center ">
									<span>
										<h2 className="text-slate-800 font-bold">{driver.name}</h2>
										<h3 className="text-sm text-slate-800/80 font-medium">{driver.address}</h3>
										<ListingUnorderedList>
											<>{driver.break_slots.length} break(s)</>
											<>&middot;</>
											<>{driver.max_travel_time} min max travel</>
											<>&middot;</>
											<>{driver.max_stops} stops max</>
											<>&middot;</>
											<>
												Shift from {convertTime(driver.time_window.startTime)} -{" "}
												{convertTime(driver.time_window.endTime)}
											</>
										</ListingUnorderedList>{" "}
									</span>
									<EntryMenu
										editCallback={() => {
											const temp = drivers.filter((loc) => loc.id == driver.id)[0];
											setCurrent(temp);
											setEditDriver(true);
										}}
									/>
								</div>
							))}
					</section>
				</div>
			)}
		</>
	);
};

export default DriversTab;
