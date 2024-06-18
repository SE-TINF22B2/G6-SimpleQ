import Skeleton from "react-loading-skeleton";
import React from "react";
import { QuestionDef } from "../../../def/QuestionDef";

export default function QuestionStats(props: { question?: QuestionDef }) {
	return <>
		<span className={ "caption" }>Question Stats</span>
		<div className={ "question-stats" }>
			{ props.question ? <>
				<div className={ "question-stat" }>
					<i className={ "fi fi-rr-eye primary-icon" }/>
					<span
						className={ "question-figure" }>{ "0".replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>views</span>
				</div>
				
				<div
					className={ "question-stat" + (props.question.opinion === "like" ? " rating" : "") }>
					<i className={ "fi fi-rr-social-network primary-icon" } tabIndex={ 0 }/>
					<span
						className={ "question-figure" }>{ props.question.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>likes</span>
				</div>
				
				<div
					className={ "question-stat" + (props.question.opinion === "dislike" ? " rating" : "") }>
					<i className={ "fi fi-rr-social-network flipY primary-icon" } tabIndex={ 0 }/>
					<span
						className={ "question-figure" }>{ props.question.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>dislikes</span>
				</div>
				
				<div className={ "question-stat" }>
					<i className={ "fi fi-rr-comment-dots primary-icon" }/>
					<span
						className={ "question-figure" }>{ props.question.answers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
					<span className={ "question-unit" }>answers</span>
				</div>
			</> : <>
				<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
				<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
				<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
				<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
			</> }
		</div>
	</>
}
