import OptimizationRouteCard from "@/components/molecules/cards/OptimizationRouteCard";

import routesData from "@/data/routes.json";
import useOpenRoute from "@/hooks/useOpenRoute";
import { useRequestStore, useRouteStore } from "@/store";

import { Header, Subheader } from "@/components/atoms";

import getUniqueKey from "@/utils/getUniqueKey";
const CalculationsTab = () => {
	const locations = useRouteStore((state) => state.locations);
	const drivers = useRouteStore((state) => state.drivers);

	const driversMap = new Map(drivers.map((obj) => [obj.id, obj]));
	const locationsMap = new Map(locations.map((obj) => [obj.id, obj]));

	const { getOptimization } = useOpenRoute();
	const optimization = useRequestStore((state) => state.optimization);
	const setOptimization = useRequestStore((state) => state.setOptimization);
	const appendMap = useRequestStore((state) => state.appendMap);
	const cachedOptimizations = useRequestStore((state) => state.cachedOptimizations);

	const getRoutes = () => {
		getOptimization().then((data) => {
			setOptimization(data);
		});
	};

	// const getRoutesDev = async () => {
	// 	console.log(routesData);
	// 	console.log(drivers);
	// 	console.log(driversMap);

	// 	const uniqueKey = await getUniqueKey({ locations, drivers }).then((data) => {
	// 		return data;
	// 	});
	// 	if (cachedOptimizations.has(uniqueKey)) {
	// 		console.log("getting from cache");
	// 		setOptimization(cachedOptimizations.get(uniqueKey));
	// 	} else {
	// 		appendMap("cachedOptimizations", uniqueKey, routesData);
	// 		setOptimization(routesData);
	// 	}
	// };

	return (
		<>
			<Header>Calculate Routes</Header>
			<Subheader>Based on these results, generate routes!</Subheader>

			<div className="flex flex-col gap-2">
				{optimization &&
					optimization?.data.routes.map((route) => (
						<OptimizationRouteCard route={route} drivers={driversMap} locations={locationsMap} key={route.vehicle} />
					))}

				<button
					className={`mt-8 inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-lg font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 cursor-pointer`}
					onClick={getRoutes}>
					{optimization ? "Regenerate" : "Generate"} my routes
				</button>
			</div>
		</>
	);
};

export default CalculationsTab;
