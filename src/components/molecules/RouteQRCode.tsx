import QRCode from "qrcode.react";
import React, { FC } from "react";

const RouteQRCode: FC<any> = ({ vehicle }) => {
	const vehicleData = JSON.stringify(vehicle);
	const encodedData = encodeURIComponent(vehicleData);
	const url = `http://localhost:5173/route?data=${encodedData}`;
	console.log(url);

	return <QRCode value={url} renderAs="svg" className="w-full h-full" />;
};

export default RouteQRCode;
