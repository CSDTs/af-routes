const { resolve } = require("path");
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	envDir: "./src",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src/"),
		},
	},
	define: {
		"process.env": process.env,
	},
	server: {
		watch: {
			usePolling: true,
		},
		host: true, // needed for the Docker Container port mapping to work
		strictPort: true,
		port: 5173, // you can replace this port with any port
	},
});
