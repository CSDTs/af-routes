import { ChangeEvent, FormEvent, ReactNode } from "react";

interface InputProps {
	name: string;
	inputValue: string | number;
	options: string[];
	handleChange: (e: FormEvent<HTMLSelectElement>) => void;
	children?: ReactNode;
}
export default function TableSelect({ name, inputValue, options, handleChange, children }: InputProps) {
	return (
		<div>
			<div className="relative mt-1 rounded-md shadow-sm">
				<select
					name={name.toLowerCase()}
					title={name}
					className="block w-full rounded-md text-gray-800 border-gray-300  bg-gray-100 pl-7  pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					value={inputValue}
					onChange={handleChange}>
					{options &&
						options.map((option, idx) => (
							<option key={idx} value={option.toLowerCase()}>
								{option}
							</option>
						))}
				</select>

				{children}
			</div>
		</div>
	);
}
