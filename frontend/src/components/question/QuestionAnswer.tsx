import { AnswerDef } from "../../def/QuestionDef";
import React from "react";
import { useTranslation } from "react-i18next";
import Section from "../section/Section";
import Avatar from "../avatar/Avatar";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../def/converter";
import sanitizeHtml from 'sanitize-html';
import ButtonGroup from "../buttongroup/ButtonGroup";
import Button from "../button/Button";

/**
 * Renders an answer to be displayed in QuestionView
 * @param props holds the answer and a function to be executed once the author's name is clicked
 */
export default function QuestionAnswer(props: {
	answer?: AnswerDef, setActiveProfile?: (authorId: string) => void,
	postVote?: (vote: "like" | "dislike") => Promise<void>
}) {
	const { t } = useTranslation();
	
	return <Section className={ "transparent" } style={ { alignItems: "stretch" } }>
		<div style={ { display: "flex", flexDirection: "column", alignItems: "center" } }>
			{ props.answer
				? props.answer.author.type === 'ai'
					? <i className={ "fi fi-rr-brain avatar" }
						 style={ {
							 fontSize: "1.4em",
							 color: "var(--primary-color-contrast)",
							 background: "var(--primary-color)"
						 } }/>
					: <Avatar userId={ "" }/>
				: <Skeleton height={ "var(--ui-spacing)" } width={ "var(--ui-spacing)" }/>
			}
			
			<div style={ {
				flex: 1,
				marginTop: "calc(-1 * var(--ui-spacing) - var(--spacing) * 2)",
				width: "var(--outline-width)",
				background: "var(--border-color)",
				borderRadius: "var(--border-radius)"
			} }/>
		</div>
		
		<div style={ { flex: 1 } }>
			<p style={ { display: "flex", alignItems: "center", gap: "calc(var(--spacing) / 2)" } }>
				{ props.answer?.author
					? <span className={ "inline-link" } tabIndex={ 0 }
							onClick={ () => props.answer?.author && props.setActiveProfile && props.setActiveProfile(props.answer.author.id) }
							onKeyUp={ (e) => e.key === 'Enter' && props.answer?.author && props.setActiveProfile && props.setActiveProfile(props.answer.author.id) }>
						{ props.answer.author.name }
					</span>
					: <Skeleton width={ 120 }/>
				}
				
				{ props.answer?.author?.type
					? props.answer.author.type !== 'user' &&
                    <span className={ "badge" }>{ props.answer.author.type }</span>
					: <Skeleton width={ "var(--ui-spacing)" }/> }
				
				<span style={ { flex: 1 } }/>
				
				<span className={ "caption" }>
					{ props.answer
						? <span style={ { display: "inline-flex" } }>
							<i className={ "fi fi-rr-clock" }
							   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
							{ t('dashboard.questionView.answer.creationDate', { answerCreationDate: formatDate(props.answer.created) }) }
						</span>
						: <Skeleton width={ 80 }/>
					}
				</span>
			</p>
			
			<div style={ { display: "flex" } }>
				<div className={ "glass" } style={ {
					flex: 1,
					marginTop: "calc(var(--spacing) / 2)",
					background: "var(--background-color-glass" + (props.answer?.author?.type === 'ai' ? "-simp" : "") + ")"
				} }>
					{ props.answer?.content
						? <p dangerouslySetInnerHTML={ { __html: sanitizeHtml(props.answer.content) } }/>
						: <p><Skeleton style={ { width: "100%" } } count={ 3 }/></p>
					}
				</div>
			</div>
		</div>
		
		<ButtonGroup vertical style={ { alignSelf: "flex-end" } }>
			{ props.answer ? <Button slim icon={ "fi fi-rr-social-network" } style={ { width: 100 } }
									 buttonStyle={ props.answer?.opinion === "dislike" ? "primary" : "glass" }
									 onClick={ async () => props.postVote && await props.postVote("like") }>
				{ props.answer?.likes }
			</Button> : <Skeleton width={ 100 }/> }
			
			{ props.answer ? <Button slim icon={ "fi fi-rr-social-network flipY" } style={ { width: 100 } }
									 buttonStyle={ props.answer?.opinion === "dislike" ? "primary" : "glass" }
									 onClick={ async () => props.postVote && await props.postVote("dislike") }>
				{ props.answer?.dislikes }
			</Button> : <Skeleton width={ 100 }/> }
		</ButtonGroup>
	</Section>
}