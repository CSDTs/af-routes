import { FC, MouseEventHandler, ReactNode } from "react";

interface BtnProps {
	clickHandler: MouseEventHandler;
	children: ReactNode;
}
const PrimaryBtn: FC<BtnProps> = ({ clickHandler, children }) => {
	return (
		<button
			type="button"
			onClick={clickHandler}
			className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
			{children}
		</button>
	);
};
export default PrimaryBtn;
