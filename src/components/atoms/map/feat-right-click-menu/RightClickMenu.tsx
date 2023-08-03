import { useRouteStore } from "@/store";
import { FC } from "react";

interface IProps {
	onDelete: () => void;
	onEdit: () => void;
	onView: () => void;
	position: { x: number; y: number } | null;
	data: number | null;
}
const RightClickMenu: FC<IProps> = ({ onDelete, onEdit, onView, position, data }) => {
	const locations = useRouteStore((state) => state.locations);
	const location = locations.find((loc) => loc.id === data);
	return (
		<div
			onMouseDown={(e) => e.stopPropagation()}
			className={`absolute z-[100] bg-white p-1 border border-black right-click-menu`}
			style={{ left: position?.x, top: position?.y }}>
			<div className="relative inline-block text-left">
				<section className="absolute left-0  w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						{location && (
							<p className="text-base px-2 py-2 font-semibold">
								{location.coordinates?.latitude}, {location.coordinates?.longitude}
							</p>
						)}

						{location && <p className="text-sm px-2 py-2 font-medium">{location.address}</p>}
					</div>
					<div className="px-1 py-1">
						<div>
							<button
								type="button"
								onClick={onEdit}
								className="hover:bg-violet-500 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
								Edit
							</button>
						</div>
						<div>
							<button
								onClick={onView}
								className="hover:bg-violet-500 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
								View
							</button>
						</div>
					</div>
					<div className="px-1 py-1">
						<div>
							<button
								onClick={onDelete}
								className="hover:bg-violet-500 hover:text-white text-gray-900  group flex w-full items-center rounded-md px-2 py-2 text-sm">
								Delete
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};
export default RightClickMenu;
