import "./QuestionPreview.scss";
import Skeleton from "react-loading-skeleton";
import React from "react";

/**
 * Renders a skeleton, based on QuestionPreview
 */
export default function QuestionPreviewSkeleton(props: { count?: number }) {
	const { count = 1 } = props;
	const skeletonArray = Array.from({ length: count });
	
	return skeletonArray.map((_, i) => {
		return <div className={ "container questions-question" } style={ { cursor: "auto" } } key={ i }>
			<div className={ "question" }>
				<Skeleton containerClassName={ "tags" }/>
				
				<h2>
					<Skeleton width={ 400 }/>
				</h2>
				
				<Skeleton containerClassName={ "caption" } width={ 300 }/>
			</div>
			
			<div className={ "question-details-wrapper" }>
				<div className={ "question-stats" }>
					<div className={ "question-stat" }>
						<Skeleton width={ 80 } height={ 24 }/>
					</div>
					
					<div className={ "question-stat" }>
						<Skeleton width={ 80 } height={ 24 }/>
					</div>
				</div>
				
				<div className={ "question-stats" }>
					<div className={ "question-stat" }>
						<Skeleton width={ 80 } height={ 24 }/>
					</div>
					
					<div className={ "question-stat" }>
						<Skeleton width={ 80 } height={ 24 }/>
					</div>
				</div>
				
				<div className={ "author" }>
					<Skeleton circle width={ "var(--ui-spacing)" } height={ "var(--ui-spacing)" }/>
					
					<p style={ { margin: 0, display: "flex", flexDirection: "column" } }>
						<Skeleton width={ 80 } height={ 12 }/>
						<Skeleton width={ 80 } height={ 20 }/>
					</p>
				</div>
			</div>
		</div>
	})
}
