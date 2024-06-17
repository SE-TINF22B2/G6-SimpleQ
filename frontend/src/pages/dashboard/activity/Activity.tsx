import Section from "../../../components/section/Section";
import Timeline from "../../../components/timeline/Timeline";
import React from "react";
import history from "../../../illustrations/history.svg";
import Dropdown from "../../../components/dropdown/Dropdown";
import Button from "../../../components/button/Button";

/**
 * Renders the activity page, currently static
 */
export default function Activity(props: {}) {
	return <>
		<Section>
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-sr-list-timeline" }/>
						Activity
					</h1>
					<p>Something happened today</p>
					
					<div style={ {
						display: "flex",
						gap: "var(--spacing)",
						alignItems: "center",
						marginTop: "var(--spacing)"
					} }>
						<Dropdown button={ <Button icon={ "fi fi-rr-filter" }>Filter</Button> }
								  direction={ "right" }
								  items={ [
									  {
										  icon: "fi fi-rr-sort",
										  label: "Sort by",
										  shortcut: <i className={ "fi fi-rr-clock-rotate-left" }/>
									  }
								  ] }/>
					</div>
				</div>
				
				<img src={ history } alt={ "History" }
					 style={ { height: "120px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
			</div>
		</Section>
		
		<Timeline/>
	</>
}
