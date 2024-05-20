/**
 * Renders animated circular progress that goes from 0 deg (0%) to 180 deg (100%) and renders the percentage in between
 * @param props.percentage The percentage to create the progress chart
 */
export default function CircularProgress(props: { percentage: number }) {
	const pct = cleanPercentage(props.percentage);
	return <svg width={ 200 } height={ 200 } style={ { marginBottom: -80 } }>
		<g transform={ `rotate(180 ${ "100 100" })` }>
			{ Circle("var(--border-color)", 100 / 2) }
			{ Circle("var(--primary-color)", pct / 2) }
		</g>
		{ Text(props.percentage.toFixed(0) + "%") }
	</svg>;
}
const cleanPercentage = (percentage: number) => {
	const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0; // we can set non-numbers to 0 here
	const isTooHigh = percentage > 100;
	return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

const Circle = (color: string, percentage: number) => {
	const r = 70;
	const circ = 2 * Math.PI * r;
	const strokePct = ((100 - percentage) * circ) / 100; // where stroke will start, e.g. from 15% to 100%.
	return <circle r={ r }
				   cx={ 100 }
				   cy={ 100 }
				   fill="transparent"
				   stroke={ strokePct !== circ ? color : "" } // remove color as 0% sets full circumference
				   strokeWidth={ "2rem" }
				   strokeDasharray={ circ }
				   strokeDashoffset={ percentage ? strokePct : 0 }
				   strokeLinecap={ "round" }
				   style={ { transition: "all 500ms ease" } }/>;
};

const Text = (label: string) => {
	return <text x={ "50%" }
				 y={ "50%" }
				 dominantBaseline={ "central" }
				 textAnchor={ "middle" }
				 fontSize={ "1.4em" }>
		{ label }
	</text>;
};
