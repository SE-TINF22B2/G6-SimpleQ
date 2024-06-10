import { Answer } from "../../def/Question";
import React from "react";
import { useTranslation } from "react-i18next";
import Section from "../section/Section";
import Avatar from "../avatar/Avatar";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../def/converter";

/**
 * Renders an answer to be displayed in QuestionView
 * @param props holds the answer
 */
export default function QuestionAnswer(props: { answer?: Answer }) {
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
				: <Skeleton height={ 40 } width={ 40 }/>
			}
			
			<div style={ {
				flex: 1,
				marginTop: "calc(-40px - var(--spacing))",
				width: "var(--outline-width)",
				background: "var(--border-color)",
				borderRadius: "var(--border-radius)"
			} }/>
		</div>
		
		<div style={ { flex: 1 } }>
			<p style={ { display: "flex", alignItems: "center", gap: "calc(var(--spacing) / 2)" } }>
				{ props.answer?.author?.name ?? <Skeleton width={ 80 }/> }
				
				{ props.answer?.author?.type
					? props.answer.author.type !== 'user' &&
                    <span className={ "badge" }>{ props.answer.author.type }</span>
					: <Skeleton width={ 40 }/> }
				
				<span style={ { flex: 1 } }/>
				
				<span className={ "caption" }>
					{ props.answer
						? <span style={ { display: "inline-flex" } }>
							<i className={ "fi fi-rr-clock" }
							   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
							{ t('dashboard.questionView.answer.creationDate', { answerCreationDate: formatDate(props.answer.created) }) }
						</span>
						: <Skeleton width={ 40 }/>
					}
				</span>
			</p>
			
			<div className={ "glass" } style={ {
				marginTop: "calc(var(--spacing) / 2)",
				background: "var(--background-color-glass" + (props.answer?.author?.type === 'ai' ? "-simp" : "") + ")"
			} }>
				<p>
					{ props.answer?.content ?? <Skeleton style={ { width: "100%" } } count={ 3 }/> }
				</p>
			</div>
		</div>
	</Section>
}

export function QuestionAnswerDivider(props: {}) {
	return <div style={ { width: "100%", display: "flex" } }>
		<div style={ {
			borderRight: "var(--outline-width) solid var(--border-color)",
			marginTop: "calc(var(--spacing) * -1)",
			marginLeft: "calc(40px / 2 - var(--outline-width) / 2)"
		} }/>
		
		<hr style={ { margin: 0 } }/>
	</div>
}

export function QuestionAnswerPrev(props: {}) {
	return <Section className={ "transparent" } style={ { alignItems: "stretch" } }>
		<div>
			<i className={ "fi fi-rr-arrow-up avatar" }
			   style={ {
				   fontSize: "1.2em",
				   color: "var(--primary-color-contrast)",
				   background: "var(--primary-color)"
			   } }/>
		</div>
		
		<div style={ { height: "40px", display: "grid", placeItems: "center" } }>
			<a className={ "inline-link" } href={ "#" }>Previous</a>
		</div>
	</Section>
}

export function QuestionAnswerNext(props: {}) {
	return <Section className={ "transparent" } style={ { alignItems: "stretch" } }>
		<div style={ { display: "flex", flexDirection: "column", alignItems: "center" } }>
			<i className={ "fi fi-rr-arrow-down avatar" }
			   style={ {
				   fontSize: "1.2em",
				   color: "var(--primary-color-contrast)",
				   background: "var(--primary-color)"
			   } }/>
			
			<div style={ {
				flex: 1,
				marginTop: "calc(-40px - var(--spacing))",
				width: "var(--outline-width)",
				background: "var(--border-color)",
				borderRadius: "var(--border-radius)"
			} }/>
		</div>
		
		<div style={ { height: "40px", display: "grid", placeItems: "center" } }>
			<a className={ "inline-link" } href={ "#" }>Next</a>
		</div>
	</Section>
}
