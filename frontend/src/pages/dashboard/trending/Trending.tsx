import React, { useEffect } from "react";
import "./Trending.scss";
import thinking from "../../../illustrations/thinking.svg";
import LiveInput from "../../../components/liveinput/LiveInput";
import QuestionPreview from "../../../components/questionpreview/QuestionPreview";
import QuestionPreviewSkeleton from "../../../components/questionpreview/QuestionPreviewSkeleton";
import Section from "../../../components/section/Section";
import { QuestionDef } from "../../../def/QuestionDef";
import Button from "../../../components/button/Button";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import NoContent from "../../../components/NoContent";
import SectionGrid from "../../../components/section/SectionGrid";
import QuestionPreviewSmall from "../../../components/questionpreview/QuestionPreviewSmall";
import ButtonGroup from "../../../components/buttongroup/ButtonGroup";
import AdjustUserContent, { SortByDef, SortDirectionDef } from "../../../components/AdjustUserContent";

/**
 * Renders the trending page, currently static
 */
export default function Trending(props: {}) {
	const alert = useAlert();
	
	const [tab, setTab] = React.useState<"trending" | "favorites" | "my">("trending");
	const [previewStyle, setPreviewStyle] = React.useState<"normal" | "small">("normal");
	
	const [sortBy, setSortBy] = React.useState<SortByDef>(SortByDef.ldr);
	const [sortDirection, setSortDirection] = React.useState<SortDirectionDef>(SortDirectionDef.desc);
	
	const [questions, setQuestions] = React.useState<QuestionDef[] | undefined>(undefined);
	
	useEffect(() => {
		setQuestions(undefined);
		
		const fetchUrl = () => {
			switch (tab) {
				case "trending":
					return "question/trending?sortBy=" + sortBy + "&sortDirection=" + sortDirection;
				case "favorites":
					return "favourites";
				case "my":
					return "question/my";
			}
		}
		
		global.axios.get(fetchUrl(), { withCredentials: true })
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
	}, [alert, tab, sortBy, sortDirection]);
	
	return <>
		<Section className={ "transparent" } style={ { flexDirection: "column", alignItems: "stretch", gap: 0 } }>
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-sr-file-chart-line" }/>
						Browse Questions
					</h1>
					<p>See what's trending on our platform.</p>
					
					<div style={ {
						display: "flex",
						gap: "var(--spacing)",
						alignItems: "center",
						marginTop: "var(--spacing)"
					} }>
						<ButtonGroup>
							<Button buttonStyle={ tab === "trending" ? "primary" : "glass" }
									onClick={ async () => setTab("trending") }>
								Trending
							</Button>
							<Button buttonStyle={ tab === "favorites" ? "primary" : "glass" }
									onClick={ async () => setTab("favorites") }>
								Favorites
							</Button>
							<Button buttonStyle={ tab === "my" ? "primary" : "glass" }
									onClick={ async () => setTab("my") }>
								My Questions
							</Button>
						</ButtonGroup>
						
						<ButtonGroup>
							<Button buttonStyle={ previewStyle === "normal" ? "primary" : "glass" }
									icon={ previewStyle === "normal" ? "fi fi-sr-table-rows" : "fi fi-rr-table-rows" }
									onClick={ async () => setPreviewStyle("normal") }>
								Normal
							</Button>
							<Button buttonStyle={ previewStyle === "small" ? "primary" : "glass" }
									icon={ previewStyle === "small" ? "fi fi-sr-apps" : "fi fi-rr-apps" }
									onClick={ async () => setPreviewStyle("small") }>
								Small
							</Button>
						</ButtonGroup>
					</div>
				</div>
				
				<img src={ thinking } alt={ "Thinking" }
					 style={ { height: "120px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
			</div>
			
			<hr style={ { marginBottom: 0 } }/>
			
			<div style={ { marginTop: "var(--spacing)", display: "flex", gap: "var(--spacing)" } }>
				<AdjustUserContent sortBy={ sortBy } setSortBy={ setSortBy }
								   sortDirection={ sortDirection } setSortDirection={ setSortDirection }
								   direction={ "right" }/>
				
				<LiveInput placeholder={ "Filter tags" }/>
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
