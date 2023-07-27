import React from "react";

import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter basename={`${import.meta.env.BASE_URL}`}>
				<App />
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>
);
