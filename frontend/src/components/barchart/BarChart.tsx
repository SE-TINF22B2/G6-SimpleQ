import React from "react";
import "./BarChart.scss";

/**
 * Renders a statistical bar chart
 * @param props.data array of numbers
 */
export default function BarChart(props: { data: number[] }) {
	const [currentValue, setCurrentValue] = React.useState<number | undefined>(undefined);
	
	return <div className={ "bar-chart" }
				onMouseOver={ () => {
					if (currentValue !== undefined) setCurrentValue(undefined);
				} }
				onMouseLeave={ () => {
					if (currentValue !== undefined) setCurrentValue(undefined);
				} }>
		<div className={ "bars" }>
			{ props.data.map((height, i) => <div key={ i } className={ "bar" } onMouseOver={ (event) => {
					event.stopPropagation();
					if (currentValue !== height) setCurrentValue(height);
				} }>
					<div style={ { height: height + "%" } }></div>
				</div>
			) }
		</div>
		<p className={ "caption" }>
			<span style={ { opacity: currentValue ? 0 : 1 } }>30d ago</span>
			<span style={ { opacity: currentValue ? 1 : 0 } }>{ currentValue ?? "" }</span>
			<span style={ { opacity: currentValue ? 0 : 1 } }>today</span>
		</p>
	</div>
}
