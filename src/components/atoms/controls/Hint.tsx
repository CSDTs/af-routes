import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { FC } from "react";

interface IProps {
	label: string;
	description: string;
}
const Hint: FC<IProps> = ({ label, description }) => {
	return (
		<span className="flex gap-4">
			{label}{" "}
			<span className="group relative w-max">
				<QuestionMarkCircleIcon className="text-slate-400 w-6 h-6" />
				<span className="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-slate-200 text-slate-500 max-w-md rounded-md p-2 shadow-md">
					{description}
				</span>
			</span>
		</span>
	);
};

export default Hint;
