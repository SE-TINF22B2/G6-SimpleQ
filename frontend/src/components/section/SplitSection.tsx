import React from "react";

interface Props {
	children: React.ReactNode;
	className?: string;
}

/**
 * Renders a wrapper for sections to display multiple sections next to each other
 * @param props.children Sections to be rendered next to each other
 * @param props.className Optional string to be appended to the classname of the split section wrapper
 */
export default function SplitSection(props: Props) {
	return <div className={ "container transparent" + (props.className ? " " + props.className : "") }>
		{ props.children }
	</div>
}
