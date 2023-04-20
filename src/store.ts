import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Driver, Location } from "./types";
interface LocationTableRow {
	address: string;
	duration: number;
	timeWindow: string;
	priority: string;
}
interface RouteState {
	locations: Location[];
	drivers: Driver[];
	setLocations: (locations: Location[]) => void;
	setDrivers: (drivers: Driver[]) => void;
	appendLocation: (location: Location) => void;
	appendDriver: (driver: Driver) => void;
	[key: string]: any;
	setData: <T>(arrName: string, data: T) => void;
}

interface RequestState {
	cachedDirections: Map<string, any>;
	cachedIsochrones: Map<string, any>;
	setMap: <T>(mapName: string, cachedRequests: Map<string, T>) => void;
	appendMap: <T>(mapName: string, address: string, response: T) => void;
	[key: string]: any;
}

interface LocationTableState {
	rows: LocationTableRow[];
	setRows: (rows: LocationTableRow[]) => void;
}

export const useRouteStore = create<RouteState>()(
	devtools(
		persist(
			(set) => ({
				locations: [],
				drivers: [],
				setLocations: (locations) => set({ locations }),
				setDrivers: (drivers) => set({ drivers }),
				appendLocation: (location) => set((state) => ({ locations: [...state.locations, location] })),
				appendDriver: (driver) => set((state) => ({ drivers: [...state.drivers, driver] })),
				setData: <T>(arrName: string, data: T) => set({ [arrName]: data }),
				appendData: <T>(arrName: string, data: T) => set((state) => ({ [arrName]: [...state[arrName], data] })),
			}),
			{
				name: "route-storage",
			}
		)
	)
);

export const useRequestStore = create<RequestState>((set) => ({
	cachedDirections: new Map<string, any>(),
	cachedIsochrones: new Map<string, any>(),
	setMap: <T>(mapName: string, cachedRequests: Map<string, T>) => set({ [mapName]: cachedRequests }),
	appendMap: <T>(mapName: string, address: string, response: T) =>
		set((state) => ({
			[mapName]: new Map([...(state[mapName as keyof RequestState] || []), [address, response]]),
		})),
}));

export const useTableStore = create<LocationTableState>((set) => ({
	rows: [],
	setRows: (rows) => set({ rows }),
}));
