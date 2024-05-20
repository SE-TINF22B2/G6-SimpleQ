import Section from "../../components/section/Section";
import React from "react";
import SectionGrid from "../../components/section/SectionGrid";

export default function MyQuestions(props: {}) {
	return <>
		<Section>
			<h1>
				<i className={ "far fa-rectangle-list" }/>
				My Questions
			</h1>
			<p>Here you can see all the questions you have asked.</p>
		</Section>
		
		<SectionGrid>
			<Question/>
			<Question/>
			<Question/>
			<Question/>
			<Question/>
			<Question/>
			<Question/>
		</SectionGrid>
	</>;
}

function Question(props: {}) {
	return <Section className={ "glass-hover" }
					style={ { userSelect: "none", cursor: "pointer" } }
					tabIndex={ 0 }>
		<div style={ { display: "flex", alignItems: "center", gap: "var(--spacing)" } }>
			<div style={ { flex: 1 } }>
				<p className={ "tags" }>
					<span className={ "badge badge-outline" }>
						<i className={ "far fa-question" }
						   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						Question
					</span>
					
					<span className={ "tags-divider" }/>
					
					<span className={ "badge" }>React</span>
					<span className={ "badge" }>Javascript</span>
				</p>
				
				<h2 style={ { marginBlock: "calc(var(--spacing) / 2)" } }>How to use React?</h2>
				
				<p className={ "caption" }>
					<span style={ { marginRight: "var(--spacing)" } }>
						<i className={ "far fa-clock" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						Created: 2021-08-01
					</span>
					
					<span>
						<i className={ "far fa-user" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						Updated: 2021-08-01
					</span>
				</p>
			</div>
			
			<div className={ "question-stats" }>
				<div className={ "question-stat" }>
					<i className={ "far fa-thumbs-up primary-icon" }/>
					<span className={ "question-figure" }>1</span>
				</div>
				
				<div className={ "question-stat" }>
					<i className={ "far fa-thumbs-down primary-icon" }/>
					<span className={ "question-figure" }>1</span>
				</div>
			</div>
			
			<div className={ "question-stats" }>
				<div className={ "question-stat" }>
					<i className={ "far fa-eye primary-icon" }/>
					<span className={ "question-figure" }>1</span>
				</div>
				
				<div className={ "question-stat" }>
					<i className={ "far fa-comment primary-icon" }/>
					<span className={ "question-figure" }>1</span>
				</div>
			</div>
		</div>
	</Section>;
}
