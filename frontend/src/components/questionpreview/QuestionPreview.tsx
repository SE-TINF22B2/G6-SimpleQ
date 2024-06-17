import "./QuestionPreview.scss";
import React from "react";
import { useNavigate } from "react-router-dom";
import { QuestionDef } from "../../def/QuestionDef";
import Avatar from "../avatar/Avatar";
import { formatDate } from "../../def/converter";
import { useTranslation } from "react-i18next";

interface Props {
	question: QuestionDef;
	index: number;
}

/**
 * Renders a preview of a question, including the title, tags and basic stats
 * @param props.question Question to be previewed
 * @param props.index Index of the preview to be rendered, also used for changing direction
 */
export default function QuestionPreview(props: Props) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	
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
				<span className={ "badge badge-outline" }>
					<i className={ props.question.isDiscussion ? "fi fi-rr-comments-question" : "fi fi-rr-interrogation" }
					   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
					{ props.question.isDiscussion ? t('components.question.type.discussion') : t('components.question.type.question') }
				</span>
				
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
					{ formatDate(props.question.created) }
				</span>
				
				<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
				
				<span style={ { display: "inline-flex" } }>
					<i className={ "fi fi-rr-refresh" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
					{ formatDate(props.question.updated) }
				</span>
			</p>
		</div>
		
		<div className={ "question-details-wrapper" }>
			<div className={ "question-stats" }>
				<div
					className={ "question-stat" + (props.question.opinion === "like" ? " rating" : "") }>
					<i className={ "fi fi-rr-social-network primary-icon" }/>
					<span
						className={ "question-figure" }>{ props.question.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>likes</span>
				</div>
				
				<div
					className={ "question-stat" + (props.question.opinion === "dislike" ? " rating" : "") }>
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
				<Avatar userName={ props.question.author.name }/>
				<p style={ { margin: 0, display: "flex", flexDirection: "column" } }>
					<span className={ "caption" }>Asked by</span>
					<span>{ props.question.author.name.substring(0, import.meta.env.VITE_AUTHOR_NAME_MAX_LENGTH) }</span>
				</p>
			</div>
		</div>
	</div>
}
