import OptimizationRouteCard from "@/components/molecules/cards/OptimizationRouteCard";

import useOpenRoute from "@/hooks/useOpenRoute";
import { useRequestStore, useRouteStore } from "@/store";

/**
 * This component is responsible for displaying the calculated routes from the our own VROOM optimization server.
 */
const CalculationsTab = () => {
	const locations = useRouteStore((state) => state.locations);
	const drivers = useRouteStore((state) => state.drivers);

	const driversMap = new Map(drivers.map((obj) => [obj.id, obj]));
	const locationsMap = new Map(locations.map((obj) => [obj.id, obj]));

	const { getOptimization } = useOpenRoute();
	const optimization = useRequestStore((state) => state.optimization);
	const setOptimization = useRequestStore((state) => state.setOptimization);

	const getRoutes = () => {
		getOptimization().then((data) => {
			setOptimization(data);
		});
	};

	return (
		<>
			<div className="flex items-center justify-center gap-4 mx-auto bg-white w-full p-3 shadow my-2">
				<button
					className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full"
					onClick={getRoutes}>
					{optimization ? "Regenerate" : "Generate"} my routes
				</button>
			</div>
			{optimization && (
				<div className="flex overflow-y-auto text-center  my-5 flex-col max-h-[calc(100vh-70px-70px-96px)] gap-y-4">
					{optimization?.data.routes.map((route) => (
						<OptimizationRouteCard route={route} drivers={driversMap} locations={locationsMap} key={route.vehicle} />
					))}
				</div>
			)}
		</>
	);
};

export default CalculationsTab;
