import { QuestionDef } from "../../def/QuestionDef";
import { useTranslation } from "react-i18next";
import Section from "../section/Section";
import Avatar from "../avatar/Avatar";
import Skeleton from "react-loading-skeleton";
import sanitizeHtml from "sanitize-html";
import React from "react";
import { formatDate } from "../../def/converter";

/**
 * Renders a question
 * @param props question
 */
export default function Question(props: {
	question?: QuestionDef,
	setActiveProfile: (authorId: string) => void
}) {
	const { t } = useTranslation();
	
	return <Section className={ "transparent" } style={ { alignItems: "stretch" } }>
		<div style={ { display: "flex", flexDirection: "column", alignItems: "center" } }>
			{ props.question
				? <Avatar userName={ props.question.author.name }/>
				: <Skeleton height={ "var(--ui-spacing)" } width={ "var(--ui-spacing)" }/>
			}
			
			<div style={ {
				flex: 1,
				marginTop: "calc(-1 * var(--ui-spacing) - var(--spacing))",
				width: "var(--outline-width)",
				background: "var(--border-color)",
				borderRadius: "var(--border-radius)"
			} }/>
		</div>
		
		<div style={ { flex: 1 } }>
			<p style={ { display: "flex", alignItems: "center", gap: "calc(var(--spacing) / 2)" } }>
				{ props.question?.author
					? <span className={ "inline-link" } tabIndex={ 0 }
							onClick={ () => props.question?.author && props.setActiveProfile(props.question.author.id) }
							onKeyUp={ (e) => e.key === 'Enter' && props.question?.author && props.setActiveProfile(props.question.author.id) }>
						{ props.question.author.name }
					</span>
					: <Skeleton width={ 80 }/>
				}
				
				{ props.question?.author?.type
					? props.question.author.type !== 'user' &&
                    <span className={ "badge" }>{ props.question.author.type }</span>
					: <Skeleton width={ "var(--ui-spacing)" }/> }
				
				<span style={ { flex: 1 } }/>
				
				<span className={ "caption" }>
					{ props.question
						? <span style={ { display: "inline-flex" } }>
							<i className={ "fi fi-rr-clock" }
							   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
							{ t('dashboard.questionView.question.creationDate', {
								questionCreationDate: formatDate(props.question.created)
							}) }
							<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
							<i className={ "fi fi-rr-refresh" }
							   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
							{ t('dashboard.questionView.question.updatedDate', {
								questionUpdatedDate: formatDate(props.question.updated)
							}) }
						</span>
						: <Skeleton width={ 80 }/>
					}
				</span>
			</p>
			
			<div className={ "glass" } style={ {
				marginTop: "calc(var(--spacing) / 2)",
				background: "var(--background-color-glass)"
			} }>
				{ props.question?.content
					? <div style={ { wordBreak: "break-all" } }
						   dangerouslySetInnerHTML={ { __html: sanitizeHtml(props.question.content) } }/>
					: <div><Skeleton style={ { width: "100%" } } count={ 3 }/></div>
				}
			</div>
		</div>
	</Section>
}
