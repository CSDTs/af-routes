import locationData from "@/data/addresses.json";

import { useRouteStore } from "@/store";

import { FileUpload, PrimaryBtn, SecondaryBtn, UploadBtn } from "@/components/atoms/";
import { AddStop, EditStop } from "@/components/molecules";

import { Location } from "@/types";
import { parseCSVFile } from "@/utils/parsingData";

import { uniqueId } from "lodash";

import { useState } from "react";
import StopListingCard from "../molecules/cards/StopListingCard";

/**
 * Tab container component that allows users to add, edit, and delete stops.
 */
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
		parseCSVFile(event.target.files[0], "stop", setLocations);
	};

	return (
		<>
			<div className="flex items-center justify-center gap-4 mx-auto bg-white w-full p-3 shadow my-2">
				<PrimaryBtn clickHandler={() => setCreateNewStop(true)}>Add Stop</PrimaryBtn>
				<SecondaryBtn clickHandler={populateFromDatabase}>Autofill</SecondaryBtn>
				<UploadBtn handleOnChange={handleCSVUpload} />
			</div>
			<AddStop open={createNewStop} setOpen={setCreateNewStop} />

			{locations.length == 0 && <FileUpload dataType="stop" />}

			{current && current.address && <EditStop open={editStop} setOpen={setEditStop} stop={current} />}

			{locations.length > 0 && (
				<div className="flex overflow-y-auto text-center h-full my-5">
					<section className="w-full ">
						{locations[0]?.address != "" &&
							locations.map((listing, idx) => {
								const { id } = listing;
								return (
									<StopListingCard
										key={idx}
										stop={listing}
										onEdit={() => {
											const temp = locations.find((loc) => loc.id === id);
											if (temp) setCurrent(temp);
											setEditStop(true);
										}}
									/>
								);
							})}
					</section>
				</div>
			)}
		</>
	);
};

export default StopsTab;
