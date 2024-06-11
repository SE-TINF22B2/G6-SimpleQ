import React from "react";

/**
 * Renders a dividing component to be placed in between two other question view components
 * @param props children (optional)
 */
export function QuestionSectionTitle(props: { children?: JSX.Element | JSX.Element[] }) {
	return <div style={ {
		width: "100%",
		display: "flex",
		alignItems: "stretch",
		gap: "calc((40px - var(--outline-width)) / 2 + var(--spacing))"
	} }>
		<div style={ {
			width: "calc((40px + var(--outline-width)) / 2)",
			marginBlock: "calc(var(--spacing) * -1)",
			backgroundImage: "linear-gradient(var(--border-color) 50%, transparent 0%)",
			backgroundPosition: "right top",
			backgroundSize: "var(--outline-width) var(--spacing)",
			backgroundRepeat: "repeat-y"
		} }/>
		
		<div style={ { marginTop: "calc(var(--spacing) * 2)", flex: 1 } }>
			{ props.children }
		</div>
	</div>
}
