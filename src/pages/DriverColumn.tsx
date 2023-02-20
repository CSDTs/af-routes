import DriverTable from "../components/DriverTable";

const DriverColumn = () => {
	return (
		<form className=" w-10/12 mx-auto my-3">
			<h2 className="text-2xl">Destinations</h2>
			<p>Fill in the table below to start adding destinations.</p>

			<ul className="">
				{locations.map((listing, idx) => (
					<li key={listing.address} className="odd:bg-slate-300 even:bg-slate-100 p-3 m-1 font-medium">
						{/* <input type="checkbox" id={`address-${idx}`} name={listing.address} /> */}
						<label htmlFor={`address-${idx}`}>
							<span className="pl-2 text-lg">{listing.address.split(",")[0]}</span> <br />
							<span className="pl-5 text-sm">{listing.address.substring(listing.address.indexOf(",") + 1)}</span>
						</label>
					</li>
				))}
			</ul>

			<DriverTable handleLocationsUpdate={setLocations} />

			<button>Prev</button>
			<button>Next</button>

			<h2>Drivers</h2>
			<ul>
				{drivers.map((driver, idx) => (
					<li key={driver.name}>
						<input type="checkbox" id={`driver-${idx}`} name={driver.name} />
						<label htmlFor={`driver-${idx}`}>{driver.name}</label>
					</li>
				))}
			</ul>

			<button>Add a new driver...</button>
		</form>
	);
};

export default DriverColumn;
