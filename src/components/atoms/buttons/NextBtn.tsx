const NextBtn = ({ clickHandler, isDisabled }) => {
	return (
		<button
			onClick={clickHandler}
			className="bg-slate-700 font-semibold text-base text-white px-6 py-2 disabled:bg-slate-400 rounded w-6/12"
			disabled={isDisabled}>
			Next
		</button>
	);
};
export default NextBtn;
