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
					? <span className={ "badge badge-outline" }><i className={ "far fa-comment" }
																   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>Discussion</span>
					: <span className={ "badge badge-outline" }><i className={ "far fa-question" }
																   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>Question</span>
				}
				
				<span className={ "tags-divider" }/>
				
				{ props.question.tags.map((tag, index) =>
					<span key={ index } className={ "badge" }>{ tag }</span>) }
			</p>
			
			<h2 className={ "question-title" }>
				{ props.question.title }
			</h2>
			
			<span className={ "caption" }>
                    created: { props.question.created } · last updated: { props.question.updated }
                </span>
		</div>
		
		<div className={ "question-details-wrapper" }>
			<div className={ "question-stats" }>
				<div
					className={ "question-stat" + (props.question.rating === "like" ? " rating" : "") }>
					<i className={ "far fa-thumbs-up primary-icon" }/>
					<span
						className={ "question-figure" }>{ props.question.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>likes</span>
				</div>
				
				<div
					className={ "question-stat" + (props.question.rating === "dislike" ? " rating" : "") }>
					<i className={ "far fa-thumbs-down primary-icon" }/>
					<span
						className={ "question-figure" }>{ props.question.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>dislikes</span>
				</div>
			</div>
			
			<div className={ "question-stats" }>
				<div className={ "question-stat" }>
					<i className={ "far fa-eye primary-icon" }/>
					<span
						className={ "question-figure" }>{ "0".replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>views</span>
				</div>
				
				<div className={ "question-stat" }>
					<i className={ "far fa-comment-dots primary-icon" }/>
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
