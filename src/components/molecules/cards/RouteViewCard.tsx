import { formatTime } from "@/utils/convertTimeDate";
import { getColor } from "@/utils/getColor";
import { createClient } from "@supabase/supabase-js";
import { FC, useCallback, useMemo, useRef } from "react";
import { Resend } from "resend";

interface OptimizationProps {
	route: any;
	drivers: Map<number, any>;
	locations: Map<number, any>;
}

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import RouteQRCode from "../RouteQRCode";

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

interface UnassignedJob {
	job: number;
}

const jsonToFile = (data: object, filename: string) => {
	const jsonData = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonData], { type: "application/json" });
	return new File([blob], filename, { type: "application/json" });
};
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_API_KEY);

const OptimizationRouteCard: FC<OptimizationProps> = ({ route, drivers, locations }) => {
	const color = getColor(route.vehicle);

	const steps = useCallback(() => {
		let breaks: any = [];
		let jobs: any = [];
		route.steps.forEach((step: Step) => {
			if (step.type == "break") {
				breaks.push(step);
			}
			if (step.type == "job") {
				breaks.push(step);
			}
		});
		return breaks;
	}, [route.steps]);

	// convert seconds to to a time during the day
	const convertTime = (seconds: number) => {
		let hours = Math.floor(seconds / 3600);
		let minutes = Math.floor((seconds % 3600) / 60);
		let ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		let minutesStr = minutes < 10 ? "0" + minutes : minutes;
		let strTime = hours + ":" + minutesStr + " " + ampm;
		return strTime;
	};

	// convert seconds to minutes
	const convertMinutes = (seconds: number) => {
		let minutes = Math.floor(seconds / 60);
		return minutes;
	};

	function extractRouteInfo() {
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

		console.log(vehicles);
		return vehicles;
	}

	const parseData = () => {
		return extractRouteInfo();
	};

	return (
		<div className={" p-2 bg-slate-50  " + " shadow " + color.shadow} key={route.vehicle}>
			<div className="flex justify-between items-center">
				<p className="pb-2 text-slate-800 font-bold">
					{" "}
					{drivers.get(route.vehicle)?.name} (
					<span>
						{formatTime(route.steps[0].arrival)} to {formatTime(route.steps[route.steps.length - 1].arrival)}
					</span>
					)
				</p>
			</div>
			{/* <h2 className="text-base font-bold text-slate-600 ">Route</h2> */}
			<ul role="list" className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500">
				<li>
					<span className="w-full flex text-sm font-bold">{formatTime(route.steps[0].arrival)}</span>{" "}
					<span className="w-full flex text-sm text-slate-700 font-base">
						Start at:&nbsp;<span className="font-semibold"> {drivers.get(route.vehicle)?.address}</span>
					</span>
				</li>
				{route.steps.map((step: Step, idx: number) => (
					<>
						{step.id && step.id >= 0 && (
							<li key={`step-${step.id}`}>
								<span className="w-full flex text-sm font-medium capitalize">{convertTime(step.arrival)}</span>

								<span className="w-full flex text-sm text-slate-700 font-base">
									{step.type === "job" ? "Delivery at:" : `Break for ${convertMinutes(step?.service || 0)} mins `}
									&nbsp;
									<span className="font-semibold">{step.type === "job" ? locations.get(step?.id)?.address : ""}</span>
								</span>
							</li>
						)}
					</>
				))}
				<li>
					<span className="w-full flex text-sm font-bold">
						{formatTime(route.steps[route.steps.length - 1].arrival)}
					</span>

					<span className="w-full flex text-sm text-slate-700 font-base">
						End back at:&nbsp;<span className="font-semibold">{drivers.get(route.vehicle)?.address}</span>
					</span>
				</li>
			</ul>
			<br />
		</div>
	);
};
export default OptimizationRouteCard;
