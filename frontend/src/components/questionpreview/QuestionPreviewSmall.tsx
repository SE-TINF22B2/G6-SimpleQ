import { QuestionDef } from "../../def/QuestionDef";
import Section from "../section/Section";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../def/converter";
import React from "react";

export default function QuestionPreviewSmall(props: { question?: QuestionDef }) {
	return <Section className={ "glass-hover" }
					style={ { userSelect: "none", cursor: "pointer", pointerEvents: props.question ? "all" : "none" } }
					tabIndex={ props.question ? 0 : -1 }>
		<div style={ { display: "flex", alignItems: "center", gap: "var(--spacing)" } }>
			<div style={ { flex: 1 } }>
				<p className={ "tags" }>
					{ props.question
						? <>
						<span className={ "badge badge-outline" }>
							<i className={ "fi fi-rr-question" }
							   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
							{ props.question.title }
						</span>
							
							<span className={ "tags-divider" }/>
							
							{ props.question.tags.map((tag, index) =>
								<span className={ "badge" } key={ index }>{ tag }</span>) }
						</>
						: <Skeleton width={ 150 }/>
					}
				</p>
				
				<br/>
				
				<h2 style={ { marginBlock: "calc(var(--spacing) / 2)" } }>
					{ props.question?.title ?? <Skeleton width={ 250 }/> }
				</h2>
			</div>
			
			<div className={ "question-stats" }>
				{ props.question
					? <>
						<div className={ "question-stat" }>
							<i className={ "fi fi-rr-social-network primary-icon" }/>
							<span className={ "question-figure" }>1</span>
						</div>
						
						<div className={ "question-stat" }>
							<i className={ "fi fi-rr-social-network flipY primary-icon" }/>
							<span className={ "question-figure" }>1</span>
						</div>
					</>
					: <>
						<Skeleton width={ "var(--ui-spacing)" }/>
						<Skeleton/>
					</>
				}
			</div>
			
			<div className={ "question-stats" }>
				{ props.question
					? <>
						<div className={ "question-stat" }>
							<i className={ "fi fi-rr-eye primary-icon" }/>
							<span className={ "question-figure" }>1</span>
						</div>
						
						<div className={ "question-stat" }>
							<i className={ "fi fi-rr-comment primary-icon" }/>
							<span className={ "question-figure" }>1</span>
						</div>
					</>
					: <>
						<Skeleton width={ "var(--ui-spacing)" }/>
						<Skeleton/>
					</>
				}
			</div>
		</div>
		
		<p className={ "caption" }>
			{ props.question
				? <>
					<span style={ { display: "inline-flex" } }>
						<i className={ "fi fi-rr-clock" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						Created: { formatDate(props.question.created) }
					</span>
					
					<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
					
					<span style={ { display: "inline-flex" } }>
						<i className={ "fi fi-rr-user" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						Updated: { formatDate(props.question.updated) }
					</span>
				</>
				: <Skeleton width={ 100 }/> }
		</p>
	</Section>;
}
