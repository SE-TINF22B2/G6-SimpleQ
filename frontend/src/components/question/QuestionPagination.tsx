import Section from "../section/Section";
import Button from "../button/Button";
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * @param setAnswersPage callback function to update page
 * @param enabled enable / disable the pagination button if there are no more pages
 * @param inlineElement optional element to be placed in this section
 */
interface Props {
	setAnswersPage: () => void,
	enabled: boolean,
	inlineElement?: JSX.Element
}

/**
 * Renders a back button to be used to navigate between pages of answers in question view
 * @param props Props
 */
export function QuestionPaginationPrev(props: Props) {
	const { t } = useTranslation();
	
	return <Section className={ "transparent" } style={ { alignItems: "stretch" } }>
		<div>
			<i className={ "fi fi-rr-arrow-up avatar" }
			   style={ {
				   fontSize: "1.2em",
				   color: "var(--primary-color-contrast)",
				   background: "var(--primary-color)"
			   } }/>
		</div>
		
		<div style={ {
			flex: 1,
			height: "40px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between"
		} }>
			{ props.enabled
				? <Button onClick={ async () => props.setAnswersPage() }>
					{ t('dashboard.questionView.pagination.previous') }
				</Button>
				: <div/>
			}
			{ props.inlineElement }
		</div>
	</Section>
}

/**
 * Renders a next button to be used to navigate between pages of answers in question view
 * @param props Props
 */
export function QuestionPaginationNext(props: Props) {
	const { t } = useTranslation();
	
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
		
		<div style={ {
			flex: 1,
			height: "40px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between"
		} }>
			{ props.enabled
				? <Button onClick={ async () => props.setAnswersPage() }>
					{ t('dashboard.questionView.pagination.next') }
				</Button>
				: <div/>
			}
			{ props.inlineElement }
		</div>
	</Section>
}
