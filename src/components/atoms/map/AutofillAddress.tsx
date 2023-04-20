import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";

import { PulseLoader } from "react-spinners";
import useDebounce from "../../../hooks/useDebounce";
import PositionStackService from "../../../services/positionstack.service";

type PropTypes = {
	index: number;
	selectedAddress: any;
	handleLocationSelection: (idx: number, event: Event) => void;
};

interface PositionStackData {
	display_name: string;
	place_id: string | number;
}
export default function AutofillAddress({ index, selectedAddress, handleLocationSelection }: PropTypes) {
	const [selected, setSelected] = useState<any>(selectedAddress);
	const [query, setQuery] = useState("");
	const [filteredPeople, setFilteredPeople] = useState([]);

	useEffect(() => {
		if (selected) handleLocationSelection(index, selected);
	}, [selected]);

	useDebounce(() => PositionStackService.fetchLocationData(query, setFilteredPeople), 1000, [query]);

	return (
		<Combobox value={selected} onChange={setSelected}>
			<div className="relative mt-1">
				<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
					<Combobox.Input
						className="w-full border-none py-2 pl-3 pr-10 text-xs leading-5 text-gray-900 focus:ring-0"
						displayValue={(person: PositionStackData) => person?.display_name}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={"Start typing an address..."}
					/>

					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</Combobox.Button>
				</div>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery("")}>
					<Combobox.Options className="absolute mt-1  z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredPeople.length === 0 && query !== "" ? (
							<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
								{filteredPeople.length === 0 ? "Nothing found." : <PulseLoader size={6} color="#afafaf" />}{" "}
							</div>
						) : (
							filteredPeople.map((person: PositionStackData) => (
								<Combobox.Option
									key={person.place_id}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? "bg-teal-600 text-white" : "text-gray-900"
										}`
									}
									value={person}>
									{({ selected, active }) => (
										<>
											<span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
												{person.display_name}
											</span>
											{selected ? (
												<span
													className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
														active ? "text-white" : "text-teal-600"
													}`}>
													<CheckIcon className="h-5 w-5" aria-hidden="true" />
												</span>
											) : null}
										</>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
}
