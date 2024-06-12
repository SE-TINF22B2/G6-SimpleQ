import { QuestionDef } from "../../def/QuestionDef";
import Skeleton from "react-loading-skeleton";
import React from "react";
import Button from "../button/Button";
import ButtonGroup from "../buttongroup/ButtonGroup";

/**
 * Renders the title section of the question view
 * @param props question
 */
export default function QuestionTitle(props: {
	question?: QuestionDef,
	toggleFavorite: () => Promise<void>,
	postVote: (vote: "like" | "dislike") => Promise<void>
}) {
	return <section style={ { width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" } }>
		<div style={ {
			display: "flex",
			alignItems: "center",
			marginBottom: "calc(var(--spacing) / 2)",
			gap: "var(--spacing)"
		} }>
			<h1 style={ { flex: 1 } }>
				{ props.question?.title ?? <Skeleton width={ 300 }/> }
			</h1>
			
			{ props.question && <>
                <Button icon={ props.question?.isFavorite ? "fi fi-sr-star" : "fi fi-rr-star" }
                        iconStyle={ props.question?.isFavorite ? { color: "var(--primary-color)" } : {} }
                        onClick={ async () => await props.toggleFavorite() }>
                    Favorite
                </Button>
                
                <ButtonGroup>
                    <Button icon={ "fi fi-rr-social-network" }
                            buttonStyle={ props.question?.opinion === "like" ? "primary" : "glass" }
                            onClick={ async () => await props.postVote("like") }>
						{ props.question.likes }
                    </Button>
                    <Button icon={ "fi fi-rr-social-network flipY" }
                            buttonStyle={ props.question?.opinion === "dislike" ? "primary" : "glass" }
                            onClick={ async () => await props.postVote("dislike") }>
						{ props.question.dislikes }
                    </Button>
                </ButtonGroup>
            </> }
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
