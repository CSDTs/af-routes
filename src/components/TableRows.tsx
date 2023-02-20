function TableRows({ rowsData, deleteTableRows, handleChange }) {
	return rowsData.map((data, index) => {
		const { address } = data;
		return (
			<tr key={index}>
				<td className="border-b border-slate-100 p-4 pl-8 text-slate-50">
					<div>
						<div className="relative mt-1 rounded-md shadow-sm">
							<input
								type="text"
								name="address"
								className="block w-full rounded-md text-gray-800 border-gray-300  bg-gray-100 pl-7  pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								placeholder="e.g. 6559 Grand River Ave, Detroit, MI 48208"
								value={address}
								onChange={(evnt) => handleChange(index, evnt)}
							/>
						</div>
					</div>
				</td>

				<td>
					<button className=" bg-red-400 text-white w-full rounded-full" onClick={() => deleteTableRows(index)}>
						x
					</button>
				</td>
			</tr>
		);
	});
}

export default TableRows;
