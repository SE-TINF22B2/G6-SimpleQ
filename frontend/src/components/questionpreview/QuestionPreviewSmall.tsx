import { QuestionDef } from "../../def/QuestionDef";
import Section from "../section/Section";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../def/converter";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function QuestionPreviewSmall(props: { question?: QuestionDef }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	
	return <Section className={ "glass-hover" }
					style={ {
						userSelect: "none",
						cursor: "pointer",
						pointerEvents: props.question ? "all" : "none",
						display: "flex",
						flexDirection: "column"
					} }
					tabIndex={ props.question ? 0 : -1 }
					onClick={ () => {
						if (props.question) navigate("/dashboard/question/" + props.question.id);
					} }
					onKeyDown={ (e: any) => {
						if (props.question && e.key === "Enter")
							navigate("/dashboard/question/" + props.question.id);
					} }>
		<p className={ "tags" }>
			{ props.question
				? <>
					<span className={ "badge badge-outline" }>
						<i className={ props.question.isDiscussion ? "fi fi-rr-comments-question" : "fi fi-rr-interrogation" }
						   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						{ props.question.isDiscussion ? t('components.question.type.discussion') : t('components.question.type.question') }
					</span>
					
					<span className={ "tags-divider" }/>
					
					{ props.question.tags.map((tag, index) =>
						<span className={ "badge" } key={ index }>{ tag }</span>) }
				</>
				: <Skeleton width={ 150 }/>
			}
		</p>
		
		<h2 style={ {
			flex: 1,
			marginBlock: "calc(var(--spacing) / 2)",
			alignSelf: "flex-start",
			display: "grid",
			placeItems: "center"
		} }>
			{ props.question?.title ?? <Skeleton width={ 250 }/> }
		</h2>
		
		<p className={ "caption" }>
			{ props.question
				? <>
					<span style={ { display: "inline-flex" } }>
						<i className={ "fi fi-rr-clock" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						{ formatDate(props.question.created) }
					</span>
					
					<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
					
					<span style={ { display: "inline-flex" } }>
						<i className={ "fi fi-rr-refresh" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						{ formatDate(props.question.updated) }
					</span>
					
					<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
					
					<span style={ { display: "inline-flex" } }>
						<i className={ "fi fi-rr-comment" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						{ props.question.answers }
					</span>
					
					<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
					
					<span style={ { display: "inline-flex" } }>
						<i className={ "fi fi-rr-social-network" }
						   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						{ props.question.likes }
					</span>
					
					<span style={ { marginInline: "calc(var(--spacing) / 2)" } }>·</span>
					
					<span style={ { display: "inline-flex" } }>
						<i className={ "fi fi-rr-social-network flipY" }
						   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
						{ props.question.dislikes }
					</span>
				</>
				: <Skeleton width={ 100 }/> }
		</p>
	</Section>;
}
