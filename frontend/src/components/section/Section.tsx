import React from "react";

interface Props {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	tabIndex?: number;
}

export default function Section(props: Props) {
	return <section className={ "container" + (props.className ? " " + props.className : "") }
					style={ props.style }
					tabIndex={ props.tabIndex }>
		{ props.children }
	</section>
}
