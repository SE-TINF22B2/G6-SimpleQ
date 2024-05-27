import "./QuestionPreview.scss";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Question } from "../../def/Question";

interface Props {
	question: Question;
	index: number;
}

/**
 * Renders a preview of a question, including the title, tags and basic stats
 * @param props.question Question to be previewed
 * @param props.index Index of the preview to be rendered, also used for changing direction
 */
export default function QuestionPreview(props: Props) {
	const navigate = useNavigate();
	
	return <div className={ "container questions-question focus-indicator glass-hover" }
				tabIndex={ 0 }
				style={ { order: props.index } }
				onClick={ () => {
					navigate("/dashboard/question/" + props.question.id);
				} }
				onKeyDown={ (e: any) => {
					if (e.key === "Enter")
						navigate("/dashboard/question/" + props.question.id);
				} }>
		<div className={ "question" }>
			<p className={ "tags" }>
				{ props.question.isDiscussion
					? <span className={ "badge badge-outline" }><i className={ "fi fi-rr-comments-question" }
																   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>Discussion</span>
					: <span className={ "badge badge-outline" }><i className={ "fi fi-rr-interrogation" }
																   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>Question</span>
				}
				
				<span className={ "tags-divider" }/>
				
				{ props.question.tags.map((tag, index) =>
					<span key={ index } className={ "badge" }>{ tag }</span>) }
			</p>
			
			<h2 className={ "question-title" }>
				{ props.question.title }
			</h2>
			
			<p className={ "caption" }>
				<span style={ { display: "inline-flex" } }>
					<i className={ "fi fi-rr-clock" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
					Created: { props.question.created }
				</span>
				
				<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
				
				<span style={ { display: "inline-flex" } }>
					<i className={ "fi fi-rr-user" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
					Updated: { props.question.updated }
				</span>
			</p>
		</div>
		
		<div className={ "question-details-wrapper" }>
			<div className={ "question-stats" }>
				<div
					className={ "question-stat" + (props.question.rating === "like" ? " rating" : "") }>
					<i className={ "fi fi-rr-social-network primary-icon" }/>
					<span
						className={ "question-figure" }>{ props.question.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>likes</span>
				</div>
				
				<div
					className={ "question-stat" + (props.question.rating === "dislike" ? " rating" : "") }>
					<i className={ "fi fi-rr-social-network primary-icon flipY" }/>
					<span
						className={ "question-figure" }>{ props.question.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>dislikes</span>
				</div>
			</div>
			
			<div className={ "question-stats" }>
				<div className={ "question-stat" }>
					<i className={ "fi fi-rr-eye primary-icon" }/>
					<span
						className={ "question-figure" }>{ "0".replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>views</span>
				</div>
				
				<div className={ "question-stat" }>
					<i className={ "fi fi-rr-comment-dots primary-icon" }/>
					<span
						className={ "question-figure" }>{ props.question.answers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>answers</span>
				</div>
			</div>
			
			<div className={ "author" }>
				<img className={ "avatar" } src={ "https://www.w3schools.com/w3images/avatar2.png" } alt={ "Avatar" }/>
				<p style={ { margin: 0, display: "flex", flexDirection: "column" } }>
					<span className={ "caption" }>Asked by</span>
					<span>{ props.question.author.name }</span>
				</p>
			</div>
		</div>
	</div>
}
