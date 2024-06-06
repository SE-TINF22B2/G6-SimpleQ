import { Answer } from "../../def/Question";
import React from "react";

/**
 * Renders an answer to be displayed in QuestionView
 * @param props holds the answer and an index
 */
export default function QuestionAnswer(props: { answer: Answer, index: number }) {
	return <div key={ props.index } className={ "container transparent question-answer" }>
		<div className={ "question-answer-author" }
			 style={ {
				 paddingTop: props.answer.author.type === "ai" ? "var(--spacing)" : 0,
				 paddingInline: props.answer.author.type === "ai" ? "var(--spacing)" : 0
			 } }>
			{ props.answer.author.type === "ai" ? <>
				<i className={ "fi fi-sr-brain" }
				   style={ {
					   fontSize: "2em",
					   height: "auto",
					   color: "var(--primary-color)",
					   filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))"
				   } }/>
				
				<p style={ { paddingTop: "calc(var(--spacing) * 0.5)" } }>
					<span>Simp</span>
				</p>
			</> : <div className={ "question-answer-author-user" } tabIndex={ 0 }>
				<img className={ "avatar" } src={ props.answer.author.id } alt={ "Answer Author" }/>
				
				<p>
					<span>{ props.answer.author.name }</span>
					<span className={ "badge" }>{ props.answer.author.type.toUpperCase() }</span>
				</p>
			</div> }
			
			<span className={ "caption" }>replied { props.answer.created }</span>
		</div>
		
		<div className={ "question-answer-text" }>
			<div className={ "glass" + (props.answer.author.type === "ai" ? " glass-simp" : "") }>
				<p>{ props.answer.content }</p>
			</div>
			
			<div className={ "question-answer-actions" }>
				<div
					className={ "question-answer-actions-rate" + (props.answer.opinion === "like" ? " rating" : "") }>
					<i className={ "fi fi-rr-social-network primary-icon" } tabIndex={ 0 }/>
					<span className={ "question-figure" }>{ props.answer.likes }</span>
					<span className={ "question-unit" }>likes</span>
				</div>
				
				<div
					className={ "question-answer-actions-rate" + (props.answer.opinion === "dislike" ? " rating" : "") }>
					<i className={ "fi fi-rr-social-network flipY primary-icon" } tabIndex={ 0 }/>
					<span className={ "question-figure" }>{ props.answer.dislikes }</span>
					<span className={ "question-unit" }>dislikes</span>
				</div>
				
				<div style={ { flex: 1 } }/>
				
				<button className={ "question-report" }>
					<i className={ "fi fi-rr-flag" }/>
					Report answer
				</button>
			</div>
		</div>
	</div>
}
