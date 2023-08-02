import CarMarker from "@/components/atoms/map/CarMarker";
import CustomMarker from "@/components/atoms/map/CustomMarker";
import OptimizationRouteCard from "@/components/molecules/cards/OptimizationRouteCard";
import useOpenRoute from "@/hooks/useOpenRoute";
import { Step } from "@/types";
import { formatTime } from "@/utils/convertTimeDate";
import { lookupAddress } from "@/utils/geocodeAddress";
import { getStyle } from "@/utils/getColor";
import polyline from "@mapbox/polyline";
import { createClient } from "@supabase/supabase-js";
import L, { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_API_KEY);
const RoutePage = () => {
	const mapRef = useRef<any>(null);

	const { reverseOptimization } = useOpenRoute();
	// Get data from URL param
	const [queryParameters] = useSearchParams();
	const [results, setResults] = useState<any>(null);
	const [geometry, setGeometry] = useState<any>(null);
	const [steps, setSteps] = useState<any>(null);
	const [stepAddresses, setStepAddresses] = useState<string[]>([]);
	useEffect(() => {
		if (steps && steps.length > 0 && mapRef.current) {
			const bounds = L.latLngBounds(
				steps.filter((step: any) => step.type !== "break").map((step: any) => [step.location[1], step.location[0]])
			);
			const increasedBounds = bounds.pad(0.15);
			mapRef.current.fitBounds(increasedBounds);
		}

		const fetchData = async () => {
			if (steps && steps.length > 0) {
				const addresses: string[] = [];
				for (const step of steps) {
					try {
						const { display_name } = await lookupAddress(String(step.location[1]), String(step.location[0]));
						addresses.push(display_name);
					} catch (error) {
						addresses.push("Address not found");
						console.error("Error while reverse geocoding:", error);
					}
				}
				setStepAddresses(addresses);
			}
		};

		fetchData();
	}, [steps]);

	useEffect(() => {
		const getData = async () => {
			const { data, error } = await supabase.storage.from("routes").download(`${queryParameters.get("data")}.json`);
			if (error) {
				console.error(error);
			} else if (data) {
				const arrayBuffer = await data.arrayBuffer();
				const jsonString = new TextDecoder("utf-8").decode(arrayBuffer);
				const jsonObject = JSON.parse(jsonString);

				return {
					data: jsonObject,
					error,
				};
			}
			return {
				data,
				error,
			};
		};

		if (queryParameters.get("data"))
			getData()
				.then((res) => {
					setResults(res.data);
					setSteps(res.data.steps);

					reverseOptimization(res.data.geometry).then((res) => {
						setGeometry(res);
					});
				})
				.catch((err) => {
					console.log(err);
				});
	}, []);
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

	return (
		<div className="flex">
			<section className="flex flex-col justify-between w-full bg-white h-6/12 md:w-full lg:w-5/12 lg:h-full xl:w-4/12 2xl:w-4/12">
				<div className="flex flex-col gap-2">
					{stepAddresses && steps && steps.length > 0 && stepAddresses.length > 0 && (
						<div className="p-2 bg-slate-50 shadow">
							<div className="flex justify-between items-center">
								<p className="pb-2 text-slate-800 font-bold">
									{results.description} (
									<span>
										{formatTime(steps[0].arrival)} to {formatTime(steps[steps.length - 1].arrival)}
									</span>
									)
								</p>
							</div>
							<ul role="list" className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500">
								<li>
									<span className="w-full flex text-sm font-bold">{formatTime(steps[0].arrival)}</span>{" "}
									<span className="w-full flex text-sm text-slate-700 font-base">Start at:&nbsp;</span>{" "}
									<span className="w-full flex text-sm text-slate-700  font-semibold"> {stepAddresses[0]}</span>
								</li>
								{steps.map((step: Step, idx: number) => (
									<>
										{step.id && step.id >= 0 && (
											<li key={`step-${step.id}`}>
												<span className="w-full flex text-sm font-medium capitalize">{convertTime(step.arrival)}</span>

												<span className="w-full flex text-sm text-slate-700 font-base">
													{step.type === "job" ? "Delivery at:" : `Break time `}
													&nbsp;
												</span>
												<span className="w-full flex text-sm text-slate-700 font-semibold">
													{step.type === "job" ? stepAddresses[idx] : ""}
												</span>
											</li>
										)}
									</>
								))}
								<li>
									<span className="w-full flex text-sm font-bold">{formatTime(steps[steps.length - 1].arrival)}</span>

									<span className="w-full flex text-sm text-slate-700 font-base">End back at:&nbsp;</span>
									<span className="w-full flex text-sm text-slate-700 font-semibold">{stepAddresses[0]}</span>
								</li>
							</ul>
						</div>
					)}
				</div>
			</section>
			<section className="z-0 w-full overflow-hidden md:w-full lg:w-7/12 xl:w-9/12 2xl:w-8/12 bg-slate-500 h-6/12 lg:h-full aspect-square lg:aspect-auto relative">
				<div className="relative z-0">
					<MapContainer
						ref={mapRef}
						center={[42.279594, -83.732124]}
						zoom={15}
						style={{ zIndex: -1 }}
						doubleClickZoom={false}
						maxBounds={[
							[40.70462625, -91.6624658],
							[49.29755475, -80.8782742],
						]}
						minZoom={6.5}>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
						/>{" "}
						{steps &&
							steps.length > 0 &&
							steps
								.filter((step: any) => step.type !== "break")
								.map((step: any, index: number) => {
									if (step.type === "job")
										return (
											<CustomMarker
												key={index}
												position={[step.location[1], step.location[0]]}
												name={`Step ${index + 1}`}
											/>
										);
									else
										return <CarMarker position={[step.location[1], step.location[0]]} name={`${index}`} key={index} />;
								})}
						{geometry && <GeoJSON data={geometry} style={getStyle} />}
					</MapContainer>{" "}
				</div>
			</section>
		</div>
	);
};

export default RoutePage;
