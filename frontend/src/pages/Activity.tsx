import Section from "../components/Section";
import Timeline from "../components/Timeline";
import React from "react";
import history from "../illustrations/history.svg";
import Dropdown from "../components/dropdown/Dropdown";

interface Props {
}

export default function Activity(props: Props) {
	return <>
		<Section>
			
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>Activity</h1>
					<p>Something happened today</p>
					
					<div style={ {
						display: "flex",
						gap: "var(--spacing)",
						alignItems: "center",
						marginTop: "var(--spacing)"
					} }>
						<Dropdown button={ <p className={ "btn btn-glass" } tabIndex={ 0 }>
							<i className={ "fas fa-filter" }/>
							Filter
						</p> }
								  items={ [
									  {
										  icon: "far fa-sort",
										  label: "Sort by",
										  shortcut: <i className={ "fas fa-clock-rotate-left" }/>
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
