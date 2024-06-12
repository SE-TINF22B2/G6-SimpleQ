import aircraft from "../illustrations/aircraft.svg";
import React from "react";

export default function NoContent(props: {}) {
	return <div className={ "container" } style={ { display: "grid", placeItems: "center" } }>
		<img src={ aircraft } alt={ "Aircraft" } style={ { marginBottom: "var(--spacing)", height: 200 } }/>
		<h2>Content incoming..</h2>
	</div>
}
