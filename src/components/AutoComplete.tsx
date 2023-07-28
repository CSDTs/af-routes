import { Location } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
type Address = {
	place_id: number;
	display_name: string;
	lat: number;
	lon: number;
};

interface IProps {
	setData: (data: Partial<Location>) => void;
	editValue?: Address;
}
const AutocompleteAddressInput: React.FC<IProps> = ({ setData, editValue }) => {
	const [inputValue, setInputValue] = useState<Address>({ display_name: "", lat: 0, lon: 0, place_id: 0 });
	const [loading, setLoading] = useState(false);
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

	const fetchAddresses = async (query: string) => {
		try {
			setLoading(true);
			const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
			setAddresses(response.data);
		} catch (error) {
			console.error("Error fetching addresses:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setInputValue({ display_name: newValue, lat: 0, lon: 0, place_id: 0 });

		// Clear the previous timeout, if any
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Debouncing logic: Call the fetchAddresses function after a delay of 500ms
		const newTimeoutId = setTimeout(() => {
			fetchAddresses(newValue);
		}, 300);

		setTimeoutId(newTimeoutId);
	};

	const handleAddressSelection = (selectedAddress: Address) => {
		setInputValue(selectedAddress);

		const data = {
			address: selectedAddress.display_name,
			coordinates: { latitude: selectedAddress.lat, longitude: selectedAddress.lon },
		};

		setData(data as Partial<Location>);
		setAddresses([]); // Clear the suggestions after selection
	};

	useEffect(() => {
		if (editValue && editValue?.display_name) {
			setInputValue(editValue);
		}
	}, [editValue]);
	return (
		<label className="w-full relative">
			<span>Starting Address </span>
			<input
				type="text"
				name="address"
				placeholder="e.g. 23600 Heidelberg St, Detroit, MI 48207, United States"
				className="items-center w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800"
				value={inputValue.display_name}
				onChange={handleInputChange}
			/>
			{loading && (
				<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
					{/* Replace this with your desired loading indicator, e.g., a spinner */}
					Loading...
				</div>
			)}
			{addresses.length > 0 && (
				<ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-b-lg">
					{addresses.map((address) => (
						<li
							key={address.place_id}
							className="px-4 py-2 cursor-pointer hover:bg-gray-100"
							onClick={() => handleAddressSelection(address)}>
							{address.display_name}
						</li>
					))}
				</ul>
			)}
		</label>
	);
};

export default AutocompleteAddressInput;
