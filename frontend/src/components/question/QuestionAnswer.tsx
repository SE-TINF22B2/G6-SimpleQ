import { AnswerDef } from "../../def/QuestionDef";
import React from "react";
import { useTranslation } from "react-i18next";
import Section from "../section/Section";
import Avatar from "../avatar/Avatar";
import Skeleton from "react-loading-skeleton";
import sanitizeHtml from 'sanitize-html';
import ButtonGroup from "../buttongroup/ButtonGroup";
import Button from "../button/Button";
import { Session } from "@ory/client";
import { formatDate } from "../../def/converter";

/**
 * Props of the answer
 * @param session to determine whether a user can like / dislike an answer
 * @param answer holds the answer
 * @param setActiveProfile function to be executed once the author's name is clicked
 * @param postVote function to up- or downvote this answer
 */
interface Props {
	session?: Session,
	answer?: AnswerDef,
	setActiveProfile?: (authorId: string) => void,
	postVote?: (vote: "like" | "dislike" | "none") => Promise<void>
}

/**
 * Renders an answer to be displayed in QuestionView
 * @param props props of the answer
 */
export default function QuestionAnswer(props: Props) {
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
					: <Avatar userName={ props.answer.author.name }/>
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
			<p style={ { display: "flex", alignItems: "flex-end", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<div style={ { display: "flex", alignItems: "center", gap: "calc(var(--spacing) / 2)" } }>
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
					</div>
					
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
				</div>
				
				{ props.answer && <ButtonGroup style={ { marginBottom: "calc(var(--spacing) / 2)" } }>
                    <Button slim iconLeft={ "fi fi-rr-social-network" }
                            buttonStyle={ props.answer?.opinion === "dislike" ? "primary" : "glass" }
                            onClick={ async () => props.postVote && await props.postVote(props.answer?.opinion === "like" ? "none" : "like") }
                            disabled={ props.session?.identity === undefined }>
						{ props.answer?.likes }
                    </Button>
                    
                    <Button slim iconLeft={ "fi fi-rr-social-network flipY" }
                            buttonStyle={ props.answer?.opinion === "dislike" ? "primary" : "glass" }
                            onClick={ async () => props.postVote && await props.postVote(props.answer?.opinion === "dislike" ? "none" : "dislike") }
                            disabled={ props.session?.identity === undefined }>
						{ props.answer?.dislikes }
                    </Button>
                </ButtonGroup> }
			</p>
			
			<div style={ { display: "flex" } }>
				<div className={ "glass" } style={ {
					flex: 1,
					marginTop: "calc(var(--spacing) / 2)",
					background: "var(--background-color-glass" + (props.answer?.author?.type === 'ai' ? "-simp" : "") + ")"
				} }>
					{ props.answer?.content
						? <div style={ { wordBreak: "break-word", textWrap: "pretty" } }
							   dangerouslySetInnerHTML={ { __html: sanitizeHtml(props.answer.content) } }/>
						: <div><Skeleton style={ { width: "100%" } } count={ 3 }/></div>
					}
				</div>
			</div>
		</div>
	</Section>
}
