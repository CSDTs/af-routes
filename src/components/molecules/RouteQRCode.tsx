import QRCode from "qrcode.react";
import { FC } from "react";

interface IProps {
	url: string;
}
const RouteQRCode: FC<IProps> = ({ url }) => {
	const encodedData = encodeURIComponent(url);

	const finalizedURL = `https://af-routing-app.vercel.app/route?data=${encodedData}`;

	return <QRCode value={finalizedURL} renderAs="svg" className="w-full h-full" />;
};

export default RouteQRCode;
