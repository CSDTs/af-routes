import { useState } from "react";

export default function AddressInput() {
	const [address, setAddress] = useState<string | null>("");

	return (
		<TableInput
			name={"address"}
			type="text"
			inputValue={address}
			placeholder="e.g. 6559 Grand River Ave, Detroit, MI 48208"
			handleChange={(e) => {
				setCount({ idx: idx, data: (e.target as HTMLInputElement).value });
				handleChange(idx, e);
				setIsLoading(true);
			}}>
			{" "}
			<LoadingIndicator isLoading={isLoading && count.data != ""} />
			<p className="text-gray-800 text-xs">
				{foundCoordinates?.label ?? foundCoordinates?.region_code ?? ""} {foundCoordinates?.postal_code ?? ""}
			</p>
			<p className="text-gray-800 text-xs">
				{JSON.stringify({ latitude: foundCoordinates?.latitude, longitude: foundCoordinates?.longitude })}
			</p>
			{/* <p className="text-gray-800 text-xs">{JSON.stringify(foundCoordinates)}</p> */}
			{/* {available && available.length > 0 && count.data != "" && (
                <AddressAutoComplete addresses={available} />
            )} */}
		</TableInput>
	);
}
