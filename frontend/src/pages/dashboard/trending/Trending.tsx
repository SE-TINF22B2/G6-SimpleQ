import React from "react";
import "./Trending.scss";
import QuestionList from "../../../components/QuestionList";
import Section from "../../../components/section/Section";
import thinking from "../../../illustrations/thinking.svg";
import { useTranslation } from "react-i18next";

/**
 * Renders the trending page, currently static
 */
export default function Trending(props: {}) {
	const { t } = useTranslation();
	
	const header = (filters: any) => {
		return <Section className={ "transparent" }
						style={ { flexDirection: "column", alignItems: "stretch", gap: 0 } }>
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-sr-analyse" }/>
						{ t('dashboard.trending.title') }
					</h1>
					<p>{ t('dashboard.trending.caption') }</p>
					
					<div style={ { marginTop: "var(--spacing)" } }>
						{ filters }
					</div>
				</div>
				
				<img src={ thinking } alt={ "Thinking" }
					 style={ { height: "120px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
			</div>
		</Section>
	}
	
	return <QuestionList url={ "question/trending" } header={ header }/>
}
