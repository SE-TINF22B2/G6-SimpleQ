import { QuestionDef } from "../../def/QuestionDef";
import Section from "../section/Section";
import Skeleton from "react-loading-skeleton";
import React from "react";

/**
 * Renders the stats section of a question view
 * @param props question
 */
export default function QuestionStats(props: { question?: QuestionDef }) {
	return <Section className={ "transparent" } style={ { alignItems: "stretch" } }>
		<div style={ { display: "flex", flexDirection: "column", alignItems: "center" } }>
			<i className={ "fi fi-rr-stats avatar" }
			   style={ {
				   fontSize: "1em",
				   color: "var(--primary-color-contrast)",
				   background: "var(--primary-color)"
			   } }/>
			
			<div style={ {
				flex: 1,
				marginTop: "calc(-1 * var(--ui-spacing) - var(--spacing))",
				width: "var(--outline-width)",
				background: "var(--border-color)",
				borderRadius: "var(--border-radius)"
			} }/>
		</div>
		
		<div style={ {
			flex: 1,
			height: "var(--ui-spacing)",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-evenly"
		} }>
			{ props.question
				? <>
					<div style={ {
						display: "flex",
						alignItems: "center",
						gap: "calc(var(--spacing) / 2)",
						cursor: "pointer"
					} }>
						<i className={ "fi fi-rr-social-network primary-icon" } tabIndex={ 0 }/>
						<span>{ props.question.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					</div>
					
					<div style={ {
						display: "flex",
						alignItems: "center",
						gap: "calc(var(--spacing) / 2)",
						cursor: "pointer"
					} }>
						<i className={ "fi fi-rr-social-network flipY primary-icon" } tabIndex={ 0 }/>
						<span>{ props.question.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					</div>
					
					<div style={ { display: "flex", alignItems: "center", gap: "calc(var(--spacing) / 2)" } }>
						<i className={ "fi fi-rr-eye primary-icon" }/>
						<span>{ "0".replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					</div>
					
					<div style={ { display: "flex", alignItems: "center", gap: "calc(var(--spacing) / 2)" } }>
						<i className={ "fi fi-rr-comment-dots primary-icon" }/>
						<span>{ props.question.answers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					</div>
				</>
				: <>
					<Skeleton width={ "var(--ui-spacing)" }/>
					<Skeleton width={ "var(--ui-spacing)" }/>
					<Skeleton width={ "var(--ui-spacing)" }/>
					<Skeleton width={ "var(--ui-spacing)" }/>
				</>
			}
		</div>
	</Section>
}
