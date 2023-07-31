import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const RoutePage = () => {
	// Get data from URL param
	const [queryParameters] = useSearchParams();

	useEffect(() => {
		console.log(queryParameters.get("data"));
	}, []);

	return (
		<div>
			<h1>RoutePage</h1>

			<p>{JSON.stringify(queryParameters.get("data"))}</p>
		</div>
	);
};

export default RoutePage;
