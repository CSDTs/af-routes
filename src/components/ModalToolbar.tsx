import { Location } from "../types";

type PropsType = {
	data: Array<Location> | null;
	launchModal: () => void;
	prePopulate: () => void;
};

export default function ModalToolbar({ data, launchModal, prePopulate }: PropsType) {
	return (
		<div className="flex items-center justify-center mx-auto gap-3">
			<button
				type="button"
				onClick={launchModal}
				className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
				{(data && data.length > 1 && "Edit") || "Fill"} Table
			</button>

			<button
				type="button"
				onClick={prePopulate}
				className="rounded-md bg-indigo-50 text-indigo-500 px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full">
				Autofill
			</button>
		</div>
	);
}
