// import { TimeWindow } from "@/types";
// import React, { FormEvent, useState } from "react";

// // Interface for the time window data

// interface TimeWindowProps {
// 	onAddTimeWindow: (timeWindow: TimeWindow) => void;
// }

// const TimeWindowInput: React.FC<TimeWindowProps> = ({ onAddTimeWindow }) => {
// 	const [startTime, setStartTime] = useState("");
// 	const [endTime, setEndTime] = useState("");

// 	const handleAddTimeWindow = (e: FormEvent) => {
// 		e.preventDefault();

// 		if (startTime && endTime) {
// 			const timeWindow: TimeWindow = { startTime, endTime };
// 			onAddTimeWindow(timeWindow);
// 			setStartTime("");
// 			setEndTime("");
// 		}
// 	};

// 	return (
// 		<div className="flex items-center gap-4">
// 			<label>
// 				<span className="sr-only">Start Time</span>
// 				<input
// 					type="time"
// 					value={startTime}
// 					onChange={(e) => setStartTime(e.target.value)}
// 					className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
// 				/>
// 			</label>

// 			<span> to </span>
// 			<label htmlFor="">
// 				<span className="sr-only">End Time</span>
// 				<input
// 					type="time"
// 					value={endTime}
// 					onChange={(e) => setEndTime(e.target.value)}
// 					className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
// 				/>
// 			</label>

// 			<button
// 				onClick={handleAddTimeWindow}
// 				className="bg-indigo-500 text-white font-bold text-base rounded hover:bg-indigo-400 px-2 py-1">
// 				Add Time Window
// 			</button>
// 		</div>
// 	);
// };

// export default TimeWindowInput;
import { TimeWindow } from "@/types";
import React, { FormEvent, useState } from "react";

// Interface for the time window data

interface TimeWindowProps {
	onAddTimeWindow: (timeWindow: TimeWindow, service?: number) => void;
	enableService?: boolean;
}

const TimeWindowInput: React.FC<TimeWindowProps> = ({ onAddTimeWindow, enableService = false }) => {
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [service, setService] = useState("");

	const handleAddTimeWindow = (e: FormEvent) => {
		e.preventDefault();

		if (startTime && endTime) {
			const timeWindow: TimeWindow = { startTime, endTime };
			onAddTimeWindow(timeWindow, enableService ? Number(service) : undefined);
			setStartTime("");
			setEndTime("");
			setService("");
		}
	};

	return (
		<div className="flex items-center gap-4">
			<div className="flex flex-row gap-4 items-center">
				<label>
					<span className="sr-only">Start Time</span>
					<input
						type="time"
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
						className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
					/>
				</label>
				<span> to </span>
				<label htmlFor="">
					<span className="sr-only">End Time</span>
					<input
						type="time"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
						className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
					/>
				</label>

				{enableService && (
					<label>
						<span className="sr-only">Service</span>
						<input
							min="0"
							type="number"
							value={service}
							onChange={(e) => setService(e.target.value)}
							className="items-center  w-full h-12 px-4 space-x-3 text-left bg-slate-100 rounded-lg shadow-sm sm:flex ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400 text-slate-800 "
						/>
					</label>
				)}
			</div>
			<button
				onClick={handleAddTimeWindow}
				className="bg-indigo-500 text-white font-bold text-base rounded hover:bg-indigo-400 px-2 py-1">
				Add {enableService ? "Break Slot" : "Time Window"}
			</button>
		</div>
	);
};

export default TimeWindowInput;
