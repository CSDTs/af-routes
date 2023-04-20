import { useRouteStore } from "../../store";
import RouteResults from "../RouteResults";
import { Header, Subheader } from "../atoms";
import { LocationTable } from "../molecules";
import DataList from "../molecules/lists/DataList";

const CalculationsTab = () => {
	const locations = useRouteStore((state) => state.locations);

	return (
		<>
			<Header>Calculate Routes</Header>
			<Subheader>Based on these results, generate routes!</Subheader>
			<RouteResults />
		</>
	);
};

export default CalculationsTab;
