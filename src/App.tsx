import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import TwoColumn from "./pages/TwoColumn";

function App() {
	const ROUTE_APP_URL = "http://localhost:9966/?z=13&center=42.279658%2C-83.732128&hl=en&alt=0";

	return (
		<main className="h-screen flex ">
			<TwoColumn url={import.meta.env.VITE_MAP_FRAME_URL} />
		</main>
	);
}

export default App;
