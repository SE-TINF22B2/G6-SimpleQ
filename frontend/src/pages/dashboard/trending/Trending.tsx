import React, { useEffect } from "react";
import "./Trending.scss";
import thinking from "../../../illustrations/thinking.svg";
import QuestionPreview from "../../../components/questionpreview/QuestionPreview";
import QuestionPreviewSkeleton from "../../../components/questionpreview/QuestionPreviewSkeleton";
import Section from "../../../components/section/Section";
import { QuestionDef } from "../../../def/QuestionDef";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import NoContent from "../../../components/NoContent";
import SectionGrid from "../../../components/section/SectionGrid";
import QuestionPreviewSmall from "../../../components/questionpreview/QuestionPreviewSmall";
import AdjustUserContent, { PreviewStyleDef, SortByDef, SortDirectionDef } from "../../../components/AdjustUserContent";

/**
 * Renders the trending page, currently static
 */
export default function Trending(props: {}) {
	const alert = useAlert();
	
	const [previewStyle, setPreviewStyle] = React.useState<PreviewStyleDef>(PreviewStyleDef.normal);
	
	const [sortBy, setSortBy] = React.useState<SortByDef>(SortByDef.ldr);
	const [sortDirection, setSortDirection] = React.useState<SortDirectionDef>(SortDirectionDef.desc);
	
	const [questions, setQuestions] = React.useState<QuestionDef[] | undefined>(undefined);
	
	useEffect(() => {
		setQuestions(undefined);
		
		global.axios.get("question/trending?sortBy=" + sortBy + "&sortDirection=" + sortDirection, { withCredentials: true })
			  .then(res => {
				  let _questions: QuestionDef[] = [];
				  res.data.forEach((_question: any) => {
					  if (!_question.id) return null;
					  
					  let question: QuestionDef = {
						  answers: _question.numberOfAnswers ?? 0,
						  author: _question.author ?? undefined,
						  created: _question.created ?? "0",
						  dislikes: _question.dislikes ?? 0,
						  id: _question.id,
						  isDiscussion: _question.isDiscussion ?? false,
						  likes: _question.likes ?? 0,
						  opinion: _question.opinion ?? "none",
						  tags: _question.tags ?? [],
						  title: _question.title ?? "",
						  updated: _question.updated ?? "0",
						  isFavorite: _question.isFavorite ?? false
					  }
					  _questions.push(question);
				  });
				  setQuestions(_questions);
			  })
			  .catch(err => axiosError(err, alert));
	}, [alert, sortBy, sortDirection]);
	
	return <>
		<Section className={ "transparent" } style={ { flexDirection: "column", alignItems: "stretch", gap: 0 } }>
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-sr-analyse" }/>
						Browse Questions
					</h1>
					<p>See what's trending on our platform.</p>
					
					<div style={ { marginTop: "var(--spacing)" } }>
						<AdjustUserContent previewStyle={ previewStyle } setPreviewStyle={ setPreviewStyle }
										   sortBy={ sortBy } setSortBy={ setSortBy }
										   sortDirection={ sortDirection } setSortDirection={ setSortDirection }
										   direction={ "right" }/>
					</div>
				</div>
				
				<img src={ thinking } alt={ "Thinking" }
					 style={ { height: "120px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
			</div>
		</Section>
		
		{ questions && questions.length === 0 && <NoContent/> }
		
		{ previewStyle === "normal" && (questions
				? questions.map((question, index) => <QuestionPreview question={ question } index={ index }
																	  key={ question.id }/>)
				: <QuestionPreviewSkeleton count={ 3 }/>
		) }
		
		{ previewStyle === "small" && <SectionGrid>
			{ questions
				? questions.map(question => <QuestionPreviewSmall question={ question } key={ question.id }/>)
				: <>
					<QuestionPreviewSmall/>
					<QuestionPreviewSmall/>
					<QuestionPreviewSmall/>
					<QuestionPreviewSmall/>
					<QuestionPreviewSmall/>
				</>
			}
        </SectionGrid> }
	</>;
}
