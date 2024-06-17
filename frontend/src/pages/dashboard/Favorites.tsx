import Section from "../../components/section/Section";
import React from "react";
import { useTranslation } from "react-i18next";
import favorites from "../../illustrations/like-post.svg";
import QuestionList from "../../components/QuestionList";

export default function Favorites(props: {}) {
	const { t } = useTranslation();
	
	const header = (filters: any) => {
		return <Section className={ "transparent" }
						style={ { flexDirection: "column", alignItems: "stretch", gap: 0 } }>
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-sr-analyse" }/>
						{ t('dashboard.favorites.title') }
					</h1>
					<p>{ t('dashboard.favorites.caption') }</p>
					
					<div style={ { marginTop: "var(--spacing)" } }>
						{ filters }
					</div>
				</div>
				
				<img src={ favorites } alt={ "Favorites" }
					 style={ { height: "120px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
			</div>
		</Section>
	}
	
	return <QuestionList url={ "favourites" } header={ header }/>
}
