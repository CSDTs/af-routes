import { Route, Routes } from "react-router-dom";
import Navigation from "./components/molecules/Navigation";

import "./App.css";

import DashboardPage from "./pages/DashboardPage";
import MessagingPage from "./pages/MessagingPage";
import OrdersPage from "./pages/OrdersPage";
import RoutingPage from "./pages/RoutingPage";
import TrackingPage from "./pages/TrackingPage";

function App() {
	return (
		<main className="flex flex-col h-full lg:h-screen ">
			<Navigation />
			<Routes>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/routing" element={<RoutingPage />} />
				<Route path="/orders" element={<OrdersPage />} />
				<Route path="/tracking" element={<TrackingPage />} />
				<Route path="/messaging" element={<MessagingPage />} />
			</Routes>
		</main>
	);
}

export default App;
