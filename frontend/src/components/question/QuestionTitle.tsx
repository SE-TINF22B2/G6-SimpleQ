import { QuestionDef } from "../../def/QuestionDef";
import Skeleton from "react-loading-skeleton";
import React from "react";

/**
 * Renders the title section of the question view
 * @param props question
 */
export default function QuestionTitle(props: { question?: QuestionDef }) {
	return <section style={ { width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" } }>
		<div style={ { display: "flex", alignItems: "center", marginBottom: "calc(var(--spacing) / 2)" } }>
			<h1>
				{ props.question?.title ?? <Skeleton width={ 300 }/> }
			</h1>
			
			<div style={ { flex: 1 } }/>
			
			{ props.question && <i className={ "fi fi-rr-star" } style={ { fontSize: "1.4em" } } tabIndex={ 0 }/> }
		</div>
		
		<p className={ "tags" }>
			{ props.question
				? <>
					{ props.question.isDiscussion
						? <span className={ "badge badge-outline" }>
							<i className={ "fi fi-rr-comments-question" }
							   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
							Discussion
						</span>
						: <span className={ "badge badge-outline" }>
							<i className={ "fi fi-rr-interrogation" }
							   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
							Question
						</span>
					}
					
					<span className={ "tags-divider" }/>
					
					{ props.question.tags.map((tag, index) =>
						<span key={ index } className={ "badge" }>{ tag }</span>) }
				</>
				: <Skeleton width={ 200 }/>
			}
		</p>
	</section>
}
