import { formatTime } from "@/utils/convertTimeDate";
import { getColor } from "@/utils/getColor";
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
}

interface UnassignedJob {
	job: number;
}

function QRModal({ data }: any) {
	let [isOpen, setIsOpen] = useState(false);
	const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
	const driverEmail = useRef<HTMLInputElement>(null);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const sendEmail = () => {
		if (driverEmail.current && driverEmail.current.value)
			resend.emails.send({
				from: "onboarding@resend.dev",
				to: driverEmail.current.value,
				subject: "Hello World",
				html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
			});
	};
	return (
		<>
			<button
				type="button"
				onClick={openModal}
				className="rounded-md  px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
				<span className="sr-only">Generate QR Code</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
					/>
				</svg>
			</button>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95">
								<Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Route QR Code for {data.description}
									</Dialog.Title>
									<div className="mt-2 w-full h-full">
										<RouteQRCode vehicle={data.steps} />
									</div>

									<br />

									<label htmlFor="resend_email" className=" hidden">
										Driver's Email Address{" "}
										<input type="email" name="resend_email" id="resend_email" ref={driverEmail} />
									</label>

									<div className="mt-4 w-full flex gap-x-2">
										{" "}
										<button
											type="button"
											className="mr-auto inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
											onClick={closeModal}>
											Close
										</button>
										{/* <button

											type="button"
											className=" inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={sendEmail}>
											Email QR Code
										</button> */}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

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
		};

		console.log(vehicles);
		return vehicles;
	}

	const parseData = () => {
		return extractRouteInfo();
	};

	console.log(extractRouteInfo());
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
				<QRModal data={extractRouteInfo()} />
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
