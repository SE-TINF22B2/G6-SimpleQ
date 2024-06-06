import React, { useEffect } from "react";
import "./Trending.scss";
import Dropdown from "../../../components/dropdown/Dropdown";
import thinking from "../../../illustrations/thinking.svg";
import LiveInput from "../../../components/liveinput/LiveInput";
import QuestionPreview from "../../../components/questionpreview/QuestionPreview";
import QuestionPreviewSkeleton from "../../../components/questionpreview/QuestionPreviewSkeleton";
import Section from "../../../components/section/Section";
import { Question } from "../../../def/Question";
import Button from "../../../components/button/Button";
import { formatDate } from "../../../def/converter";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import NoContent from "../../../components/NoContent";

/**
 * Renders the trending page, currently static
 */
export default function Trending(props: {}) {
	const [sortBy, setSortBy] = React.useState<"timestamp" | "likes" | "dislikes" | "views" | "answers">("timestamp");
	const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
	const [questions, setQuestions] = React.useState<Question[] | null>(null);
	
	const alert = useAlert();
	
	useEffect(() => {
		global.axios.get("question/trending")
			  .then(res => {
				  let _questions: Question[] = [];
				  res.data.forEach((_question: any) => {
					  if (!_question.id) return null;
					  
					  let question: Question = {
						  answers: _question.numberOfAnswers ?? 0,
						  author: _question.author ?? undefined,
						  created: formatDate(_question.created ?? ""),
						  dislikes: _question.dislikes ?? 0,
						  id: _question.id,
						  isDiscussion: _question.isDiscussion ?? false,
						  likes: _question.likes ?? 0,
						  opinion: _question.opinion ?? "none",
						  tags: _question.tags ?? [],
						  title: _question.title ?? "",
						  updated: formatDate(_question.updated ?? "")
					  }
					  _questions.push(question);
				  });
				  setQuestions(_questions);
			  })
			  .catch(err => axiosError(err, alert));
	}, [alert]);
	
	return <>
		<Section>
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-sr-file-chart-line" }/>
						Trending
					</h1>
					<p>See what's trending on our platform.</p>
					
					<div style={ {
						display: "flex",
						gap: "var(--spacing)",
						alignItems: "center",
						marginTop: "var(--spacing)"
					} }>
						<Dropdown button={ <Button icon={ "fi fi-rr-filter" }>Adjust questions</Button> } items={ [
							{
								icon: "fi fi-rr-sort",
								label: "Sort by",
								items: [
									{
										icon: "fi fi-rr-time-past",
										label: "Timestamp",
										shortcut: sortBy === "timestamp" ?
											<i className={ "fi fi-rr-check" }/> : undefined,
										onClick: () => setSortBy("timestamp")
									}
								],
								shortcut: <i className={ "fi fi-rr-time-past" }/>
							},
							{
								icon: "fi fi-rr-sort-amount-down",
								label: "Direction",
								items: [
									{
										icon: "fi fi-rr-arrow-trend-up",
										label: "Ascending",
										shortcut: sortDirection === "asc" ?
											<i className={ "fi fi-rr-check" }/> : undefined,
										onClick: () => setSortDirection("asc")
									},
									{
										icon: "fi fi-rr-arrow-trend-down",
										label: "Descending",
										shortcut: sortDirection === "desc" ?
											<i className={ "fi fi-rr-check" }/> : undefined,
										onClick: () => setSortDirection("desc")
									}
								],
								shortcut: <i
									className={ "fi fi-rr-arrow-trend-" + (sortDirection === "asc" ? "up" : "down") }/>
							}
						] } direction={ "right" }/>
						
						<LiveInput placeholder={ "Filter tags" }/>
					</div>
				</div>
				
				<img src={ thinking } alt={ "Thinking" }
					 style={ { height: "120px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
			</div>
			
			<hr/>
			<p className={ "tags tags-deletable" }>
				<span className={ "badge" } tabIndex={ 0 }>Smartphone</span>
				<span className={ "badge" } tabIndex={ 0 }>iPhone</span>
				<span className={ "badge" } tabIndex={ 0 }>Tag 1</span>
			</p>
		</Section>
		
		{ questions
			? questions.length > 0
				? questions.map((question, index) =>
					<QuestionPreview question={ question } index={ index } key={ index }/>)
				: <NoContent/>
			: <>
				<QuestionPreviewSkeleton/>
				<QuestionPreviewSkeleton/>
				<QuestionPreviewSkeleton/>
			</>
		}
	</>;
}
