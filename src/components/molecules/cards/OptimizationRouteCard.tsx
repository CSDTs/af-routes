import { convertMinutes, convertTime, formatTime } from "@/utils/convertTimeDate";
import { getColor } from "@/utils/getColor";

import { FC, useCallback } from "react";

interface OptimizationProps {
	route: any;
	drivers: Map<number, any>;
	locations: Map<number, any>;
}

import { Dialog, Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

import RouteQRModal from "../RouteQRModal";
interface Step {
	type: string;
	id: number;
	job: number | null;
	location: number[];
	arrival: number;
	duration: number;
	service?: number;
}

interface VehicleInfo {
	vehicle: number;
	description: string;
	steps: Step[];
	geometry: string;
}

const OptimizationRouteCard: FC<OptimizationProps> = ({ route, drivers, locations }) => {
	const color = getColor(route.vehicle);

	const extractRouteInfo = useCallback(() => {
		const vehicles: VehicleInfo = {
			vehicle: route.vehicle,
			description: route.description,
			steps: route.steps.map((step: any) => ({
				type: step.type,
				id: step.id,
				job: step.job || null,
				location: step.location,
				arrival: step.arrival,
				duration: step.duration,
			})),
			geometry: route.geometry,
		};
		return vehicles;
	}, [route]);

	return (
		<div className={" flex  flex-col p-2 bg-slate-50  " + " shadow " + color.shadow + " border-2 " + color.border}>
			<Disclosure>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex justify-between items-center ">
							<p className=" text-slate-800 font-bold flex flex-col text-left">
								{" "}
								<span>{drivers.get(route.vehicle)?.name}</span>
								<span>
									({formatTime(route.steps[0].arrival)} to {formatTime(route.steps[route.steps.length - 1].arrival)} )
								</span>
							</p>
							<span className="flex gap-4 items-center">
								<RouteQRModal data={extractRouteInfo()} />{" "}
								<ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 ` + color.text} />
							</span>
						</Disclosure.Button>
						{/* <h2 className="text-base font-bold text-slate-600 ">Route</h2> */}
						<Disclosure.Panel>
							<ul role="list" className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500 py-3">
								<li>
									<span className="w-full flex text-sm font-bold">{formatTime(route.steps[0].arrival)}</span>
									<span className="w-full flex text-sm text-slate-700 font-base">Leave from:</span>
									<span className="w-full flex text-sm text-slate-500 font-semibold">
										{drivers.get(route.vehicle)?.address}
									</span>
								</li>
								{route.steps.map((step: Step, idx: number) => (
									<Fragment key={idx}>
										{step.id && step.id >= 0 && (
											<li key={`step-${step.id}`}>
												<span className="w-full flex text-sm  capitalize font-bold">{convertTime(step.arrival)}</span>

												<span className="w-full flex text-sm text-slate-700 font-base">
													{step.type === "job"
														? "Delivery at:"
														: `Break for ${convertMinutes(step?.service || 0)} mins `}
												</span>
												<span className="w-full flex text-sm text-slate-500 font-semibold">
													{step.type === "job" ? locations.get(step?.id)?.address : ""}
												</span>
											</li>
										)}
									</Fragment>
								))}
								<li>
									<span className="w-full flex text-sm font-bold">
										{formatTime(route.steps[route.steps.length - 1].arrival)}
									</span>

									<span className="w-full flex text-sm text-slate-700 font-base">End back at:</span>
									<span className=" w-full flex text-sm text-slate-500 font-semibold">
										{drivers.get(route.vehicle)?.address}
									</span>
								</li>
							</ul>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</div>
	);
};
export default OptimizationRouteCard;
