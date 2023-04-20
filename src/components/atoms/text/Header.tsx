import { ReactNode } from "react";

type PropsType = {
	children?: ReactNode;
};

export default function Header(props: PropsType) {
	return <h2 className=" title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{props.children}</h2>;
}
