import Skeleton from "react-loading-skeleton";
import React from "react";

export default function QuestionAnswerSkeleton(props: { count?: number }) {
	const { count = 1 } = props;
	const skeletonArray = Array.from({ length: count });
	
	return skeletonArray.map((_, i) => {
		return <div className={ "container transparent question-answer" } key={ i }>
			<div className={ "question-answer-author" }>
				<Skeleton height={ 40 } width={ 40 }/>
				
				<p>
					<Skeleton height={ 20 } width={ 100 }/>
				</p>
				
				<span className={ "caption" }><Skeleton width={ 60 }/></span>
			</div>
			
			<div className={ "question-answer-text" }>
				<div className={ "glass" }>
					<p>
						<Skeleton count={ 3 }/>
					</p>
				</div>
				
				<div className={ "question-answer-actions" }>
					<Skeleton height={ 20 } width={ 100 }/>
					<Skeleton height={ 20 } width={ 100 }/>
					
					<div style={ { flex: 1 } }/>
					
					<Skeleton height={ 20 } width={ 200 }/>
				</div>
			</div>
		</div>
	})
}
