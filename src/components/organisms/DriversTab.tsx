import { FileUpload, PrimaryBtn, SecondaryBtn, UploadBtn } from "@/components/atoms/";
import { AddDriver, EditDriver } from "@/components/molecules";
import driverData from "@/data/drivers.json";
import { Driver } from "@/types";

import { uniqueId } from "lodash";

import { useState } from "react";
import { useRouteStore } from "../../store";

import { parseCSVFile } from "@/utils/parsingData";

import DriverListingCard from "../molecules/cards/DriverListingCard";

/**
 * Tab container component that allows users to add, edit, and delete drivers.
 */
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
		parseCSVFile(event.target.files[0], "driver", setDrivers);
	};
	return (
		<>
			<div className="flex items-center justify-center gap-4 mx-auto bg-white w-full p-3 shadow my-2">
				<PrimaryBtn clickHandler={() => setCreateDriver(true)}>Add Driver</PrimaryBtn>
				<SecondaryBtn clickHandler={populateFromDatabase}>Autofill</SecondaryBtn>
				<UploadBtn handleOnChange={handleCSVUpload} />
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
								<DriverListingCard
									key={idx}
									driver={driver}
									onEdit={() => {
										const temp = drivers.filter((loc) => loc.id == driver.id)[0];
										setCurrent(temp);
										setEditDriver(true);
									}}
								/>
							))}
					</section>
				</div>
			)}
		</>
	);
};

export default DriversTab;
