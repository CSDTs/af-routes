interface ButtonType {
	name: string;
	color: string;
	callback: () => void;
}

type PropTypes = {
	buttons?: Array<ButtonType>;
};

export default function TableFooter({ buttons }: PropTypes) {
	return (
		<>
			{buttons &&
				buttons.map((button) => {
					return (
						<button
							type="button"
							className={`inline-flex justify-center rounded-md border border-transparent bg-${button.color}-100 px-4 py-2 text-sm font-medium text-${button.color}-900 hover:bg-${button.color}-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-${button.color}-500 focus-visible:ring-offset-2`}
							onClick={button.callback}>
							{button.name}
						</button>
					);
				})}
		</>
	);
}
