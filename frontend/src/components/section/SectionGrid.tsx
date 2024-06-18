/**
 * Renders a grid of sections
 * @param props.children Optional array of sections, use Section!
 */
export default function SectionGrid(props: { children?: JSX.Element | JSX.Element[] | undefined }) {
	return <div style={ {
		width: "100%",
		maxWidth: "var(--max-width)",
		margin: "0 auto",
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: "var(--spacing)"
	} }>
		{ props.children }
	</div>;
}
