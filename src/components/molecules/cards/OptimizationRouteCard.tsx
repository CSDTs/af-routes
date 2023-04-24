import { Route, Step } from "@/types";
import { formatTime } from "@/utils/convertTimeDate";
import { getColor } from "@/utils/getColor";
import { FC } from "react";

interface OptimizationProps {
	route: any;
	drivers: Map<number, any>;
	locations: Map<number, any>;
}

const OptimizationRouteCard: FC<OptimizationProps> = ({ route, drivers, locations }) => {
	const color = getColor(route.vehicle);

	return (
		<div className={" p-2 bg-slate-50  " + " shadow " + color.shadow} key={route.vehicle}>
			<p className="pb-2 text-slate-800 font-bold">
				{" "}
				{drivers.get(route.vehicle)?.name} (
				<span>
					{formatTime(route.steps[0].arrival)} to {formatTime(route.steps[route.steps.length - 1].arrival)}
				</span>
				)
			</p>
			<h2 className="text-base font-semibold text-slate-700 ">Route</h2>
			<ul role="list" className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500">
				<li>
					<span className="w-full flex text-sm font-medium">Starting Location:</span>{" "}
					<span className="w-full flex text-sm text-slate-700 font-base">{drivers.get(route.vehicle)?.address}</span>
				</li>
				{route.steps.map((step: Step, idx: number) => (
					<>
						{step.id && (
							<li key={`step-${step.id}`}>
								<span className="w-full flex text-sm font-medium ">Stop {idx}:</span>{" "}
								<span className="w-full flex text-sm text-slate-700 font-base">{locations.get(step.id)?.address}</span>
							</li>
						)}
					</>
				))}
				<li>
					<span className="w-full flex text-sm font-medium">Ending Location:</span>{" "}
					<span className="w-full flex text-sm text-slate-700 font-base">{drivers.get(route.vehicle)?.address}</span>
				</li>
			</ul>

			<span></span>
		</div>
	);
};
export default OptimizationRouteCard;
