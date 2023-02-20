import { MouseEventHandler } from "react";

interface ButtonProps {
	name: string;
	event: MouseEventHandler<HTMLButtonElement>;
}

const PrimaryButton = (props: ButtonProps) => {
	return (
		<button onClick={props.event} className="bg-slate-700 font-semibold text-base text-white px-4 py-2">
			{props.name}
		</button>
	);
};
export default PrimaryButton;
