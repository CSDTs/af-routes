import { FC } from "react";

interface IProps {
	handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
/**
 * Button for uploading a file on change. Currently accepts CSV files.
 */
const UploadBtn: FC<IProps> = ({ handleOnChange }) => {
	return (
		<label className="cursor-pointer flex w-full text-center">
			<span className="rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full cursor-pointer">
				Upload...
			</span>
			<input type="file" accept=".csv" className="hidden" onChange={handleOnChange} />
		</label>
	);
};
export default UploadBtn;
