import { MutableRefObject } from "react";

const getFormValues = (formRef: MutableRefObject<HTMLFormElement | null>) => {
	const form = formRef.current;
	const inputs = form ? Array.from(form.elements) : [];

	const values: any = {};
	inputs.forEach((element: Element) => {
		if (element instanceof HTMLInputElement) {
			const input = element as HTMLInputElement;
			if (input.name) {
				values[input.name] = input.value;
			}
			if (input.type === "checkbox" || input.type === "radio") {
				values[input.name] = input.checked;
			}
		}
	});

	return values;
};

export default getFormValues;
