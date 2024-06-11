import React from "react";

/**
 * Renders a divider, used in the question view
 */
export default function QuestionDivider(props: {}) {
	return <div style={ { width: "100%", display: "flex" } }>
		<div style={ {
			borderRight: "var(--outline-width) solid var(--border-color)",
			marginTop: "calc(var(--spacing) * -1)",
			marginLeft: "calc(40px / 2 - var(--outline-width) / 2)"
		} }/>
		
		<hr style={ { margin: 0 } }/>
	</div>
}
