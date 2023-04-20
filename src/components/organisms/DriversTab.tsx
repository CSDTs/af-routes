import { useRouteStore } from "../../store";
import { Header, Subheader } from "../atoms";
import DataList from "../molecules/lists/DataList";
import DriverTable from "../molecules/tables/DriverTable";

const DriversTab = () => {
	const drivers = useRouteStore((state) => state.drivers);

	return (
		<>
			<Header>Drivers</Header>
			<Subheader>Fill in the table below to start adding drivers to map.</Subheader>
			<DataList dataType="driver" data={drivers} />
			<DriverTable dataKey={"drivers"} />

			{drivers.length == 0 && (
				<div className="h-96 bg-slate-100 flex border border-slate-300 mt-5 text-center items-center">
					<p className="my-auto mx-auto">You don't have any drivers added.</p>
				</div>
			)}
		</>
	);
};

export default DriversTab;
