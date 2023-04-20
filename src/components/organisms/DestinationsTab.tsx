import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import { LocationTable } from "../molecules";
import DataList from "../molecules/lists/DataList";

const DestinationsTab = () => {
	const locations = useRouteStore((state) => state.locations);

	return (
		<>
			<Header>Destinations</Header>
			<Subheader>Fill in the table below to start adding destinations.</Subheader>
			<DataList dataType="location" data={locations} />
			<LocationTable dataKey={"locations"} />
			{locations.length == 0 && (
				<div className="h-96 bg-slate-100 flex border border-slate-300 mt-5 text-center items-center">
					<p className="my-auto mx-auto">You don't have any destinations selected.</p>
				</div>
			)}
		</>
	);
};

export default DestinationsTab;
