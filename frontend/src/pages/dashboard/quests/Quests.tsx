import "./Quests.scss";
import SplitSection from "../../../components/section/SplitSection";
import CircularProgress from "../../../components/CircularProgress";
import Section from "../../../components/section/Section";
import { useEffect, useState } from "react";

/**
 * Renders the quests page, currently static
 */
export default function Quests(props: {}) {
	const [minutesUntilEndOfWeek, setMinutesUntilEndOfWeek] = useState<number>(0);
	const [r, setR] = useState<number>(0.1);
	
	useEffect(() => {
		setR(50);
		
		updateMinutesUntilEndOfWeek();
		let interval = setInterval(updateMinutesUntilEndOfWeek, 1000);
		return () => clearInterval(interval);
	}, []);
	
	const updateMinutesUntilEndOfWeek = () => {
		const now = new Date();
		const endOfWeek = new Date();
		endOfWeek.setHours(23, 59, 59, 999);
		endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
		
		setMinutesUntilEndOfWeek((endOfWeek.getTime() - now.getTime()) / 1000 / 60);
	}
	
	const renderQuestCountdown = () => {
		const days = Math.floor(minutesUntilEndOfWeek / 60 / 24);
		const hours = Math.floor(minutesUntilEndOfWeek / 60) % 24;
		const minutes = Math.floor(minutesUntilEndOfWeek) % 60;
		const seconds = Math.floor(minutesUntilEndOfWeek * 60) % 60;
		
		return <span style={ { fontFamily: "Courier New" } }>
			{ days.toString().padStart(2, "0") }
			:
			{ hours.toString().padStart(2, "0") }
			:
			{ minutes.toString().padStart(2, "0") }
			:
			{ seconds.toString().padStart(2, "0") }
		</span>;
	}
	
	return <>
		<Section>
			<div style={ { display: "flex", alignItems: "center", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-sr-treasure-chest" }/>
						Weekly Quests
					</h1>
					<p>Here you can see this week's quests and how far you have completed them.</p>
				</div>
				
				<i className={ "fi fi-rr-stopwatch" } style={ { fontSize: "2em" } }/>
				
				<div>
					<h2>{ renderQuestCountdown() }</h2>
					<p>until next week</p>
				</div>
			</div>
		</Section>
		
		<SplitSection className={ "quests-list" }>
			<section className={ "glass" }>
				<CircularProgress percentage={ r }/>
				<h1>Views</h1>
				<p>Get 1000 views on a question.</p>
			</section>
			
			<section className={ "glass" }>
				<CircularProgress percentage={ r }/>
				<h1>Views</h1>
				<p>Get 1000 views on a question.</p>
			</section>
			
			<section className={ "glass quest-done" }>
				<i className={ "fi fi-rr-check-circle" }/>
				<h1>Views</h1>
				<p>Get 1000 views on a question.</p>
			</section>
		</SplitSection>
	</>
}
