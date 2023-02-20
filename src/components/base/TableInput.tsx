import { ChangeEvent, FormEvent, ReactNode } from "react";

interface InputProps {
	name: string;
	type: string;
	inputValue: string | number;
	placeholder?: string;
	handleChange: (e: FormEvent<HTMLInputElement>) => void;
	children?: ReactNode;
}
export default function TableInput({ name, type, inputValue, placeholder, handleChange, children }: InputProps) {
	return (
		<div>
			<div className="relative mt-1 rounded-md shadow-sm">
				<input
					type={type}
					name={name}
					className="block w-full rounded-md text-gray-800 border-gray-300  bg-gray-100 pl-7  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder={placeholder}
					value={inputValue}
					onChange={handleChange}
				/>

				{children}
			</div>
		</div>
	);
}
