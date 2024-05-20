import Skeleton from "react-loading-skeleton";
import React from "react";

export default function QuestionPreviewSkeleton() {
	return <div className={ "container questions-question" } style={ { cursor: "auto" } }>
		<div className={ "question" }>
			<Skeleton containerClassName={ "tags" }/>
			
			<h2>
				<Skeleton/>
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
				<Skeleton circle width={ 40 } height={ 40 }/>
				
				<p style={ { margin: 0, display: "flex", flexDirection: "column" } }>
					<Skeleton width={ 80 } height={ 12 }/>
					<Skeleton width={ 80 } height={ 20 }/>
				</p>
			</div>
		</div>
	</div>
}
