import React from "react";

interface Props {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	tabIndex?: number;
}

/**
 * Renders a section
 * @param props.children Child elements of the section
 * @param props.className Optional string to be appended to the classname of the section
 * @param props.style Optional CSSProperties Object to modify the style of the section
 * @param props.tabIndex Optional number to set and adjust the tab index of the section
 */
export default function Section(props: Props) {
	return <section className={ "container" + (props.className ? " " + props.className : "") }
					style={ props.style }
					tabIndex={ props.tabIndex }>
		{ props.children }
	</section>
}
