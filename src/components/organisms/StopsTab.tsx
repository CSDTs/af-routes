import locationData from "@/data/addresses.json";

import { useRouteStore } from "@/store";

import { FileUpload, ListingUnorderedList, PrimaryBtn, SecondaryBtn } from "@/components/atoms/";
import { AddStop, EditStop, EntryMenu } from "@/components/molecules";

import { Location, TimeWindow } from "@/types";
import { parseStop } from "@/utils/parsingData";
import { convertTime } from "@/utils/timeHandlers";

import { uniqueId } from "lodash";
import * as Papa from "papaparse";
import { useState } from "react";

const StopsTab = () => {
	const locations = useRouteStore((state) => state.locations);
	const [editStop, setEditStop] = useState(false);
	const [current, setCurrent] = useState<Location | null>(null);
	const [createNewStop, setCreateNewStop] = useState(false);

	const setLocations = useRouteStore((state) => state.setLocations);

	const populateFromDatabase = () => {
		const data = locationData.map((location) => {
			return {
				...location,
				id: parseInt(uniqueId()),
			};
		});

		setLocations(data);
	};

	const handleCSVUpload = (event: any) => {
		const file = event.target.files[0];
		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			complete: (results) => {
				// Transform the data into the expected format
				const parsedData = results.data.map((row: any) => parseStop(row) as Location);

				// Update the table and store with the parsed data
				setLocations(parsedData);
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
			<AddStop open={createNewStop} setOpen={setCreateNewStop} />

			{locations.length == 0 && <FileUpload dataType="stop" />}

			{current && current.address && <EditStop open={editStop} setOpen={setEditStop} stop={current} />}

			{locations.length !== 0 && (
				<div className="flex overflow-y-auto text-center h-full my-5">
					<section className="w-full ">
						{locations.length > 0 &&
							locations[0]?.address != "" &&
							locations.map((listing, idx) => (
								<div
									key={idx}
									className="p-3 m-1 font-medium text-left odd:bg-slate-300 even:bg-slate-100 flex justify-between items-center ">
									<span className="w-10/12">
										<h2 className="text-slate-800 font-bold">{listing.customer_name}</h2>
										<h3 className="text-sm text-slate-800/80 font-medium">{listing.address}</h3>
										<ListingUnorderedList>
											<>
												<span className="font-semibold">{listing.drop_off_duration}</span> min
											</>
											<>&middot;</>
											<>{listing.priority > 50 ? "High" : "Normal"} priority</>
										</ListingUnorderedList>
										<p className="text-xs text-slate-700 mt-2">
											{listing.time_windows.map((tw: TimeWindow, idx: number) => (
												<span key={idx}>
													{convertTime(tw.startTime)} - {convertTime(tw.endTime)}
													{idx !== listing.time_windows.length - 1 && <>&#44; </>}
												</span>
											))}
										</p>
									</span>
									<EntryMenu
										editCallback={() => {
											const temp = locations.filter((loc) => loc.id == listing.id)[0];
											setCurrent(temp);
											setEditStop(true);
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

export default StopsTab;
