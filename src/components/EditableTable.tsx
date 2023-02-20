import { useState } from "react";
import TableRows from "./TableRows";
function EditableTable() {
	const [rowsData, setRowsData] = useState([]);

	const addTableRows = () => {
		const rowsInput = {
			address: "",
		};
		setRowsData([...rowsData, rowsInput]);
	};
	const deleteTableRows = (index) => {
		const rows = [...rowsData];
		rows.splice(index, 1);
		setRowsData(rows);
	};

	const handleChange = (index, evnt) => {
		const { name, value } = evnt.target;
		const rowsInput = [...rowsData];
		rowsInput[index][name] = value;
		setRowsData(rowsInput);
	};
	return (
		<div className="relative rounded-xl overflow-auto">
			<div className="shadow-sm my-8">
				<table className="border-collapse table-auto w-full text-sm">
					<thead>
						<tr>
							<th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">Address</th>
							<th></th>
						</tr>
					</thead>
					<tbody className="bg-white">
						<TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
					</tbody>
				</table>
			</div>
			<button className=" bg-green-400 text-white p-4 mt-4 rounded-sm" onClick={addTableRows}>
				+ Add New Destination
			</button>
		</div>
	);
}
export default EditableTable;
