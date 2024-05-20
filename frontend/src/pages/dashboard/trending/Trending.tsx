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

/**
 * Renders the trending page, currently static
 */
export default function Trending(props: {}) {
	const [sortBy, setSortBy] = React.useState<"timestamp" | "likes" | "dislikes" | "views" | "answers">("timestamp");
	const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
	const [questions, setQuestions] = React.useState<Question[] | null>(null);
	
	useEffect(() => {
		setTimeout(() => setQuestions([
			{
				id: "1",
				isDiscussion: false,
				title: "How to rescue water damaged iPhone 12?",
				created: "20.10.2023",
				updated: "today",
				tags: ["Smartphone", "Technical Support", "iPhone"],
				likes: 7,
				dislikes: 3,
				answers: 2,
				rating: "like",
				author: {
					id: "1",
					name: "John Doe",
					type: "user"
				}
			},
			{
				id: "2",
				isDiscussion: true,
				title: "What is the best way to learn React?",
				created: "20.10.2023",
				updated: "TODAY",
				tags: ["Tag 1", "Tag 2", "Tag 3"],
				likes: 123,
				dislikes: 5122,
				answers: 202,
				rating: "none",
				author: {
					id: "1",
					name: "John Doe",
					type: "pro"
				}
			},
			{
				id: "3",
				isDiscussion: false,
				title: "How can I improve my CSS skills?",
				created: "20.10.2023",
				updated: "TODAY",
				tags: ["Tag 1", "Tag 2", "Tag 3"],
				likes: 124231,
				dislikes: 123,
				answers: 12412,
				rating: "dislike",
				author: {
					id: "1",
					name: "John Doe",
					type: "user"
				}
			}
		]), 1000);
	}, []);
	
	return <>
		<Section className={ "trending-header" }>
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
			? questions.map((question, index) =>
				<QuestionPreview question={ question } index={ index } key={ index }/>)
			: <>
				<QuestionPreviewSkeleton/>
				<QuestionPreviewSkeleton/>
				<QuestionPreviewSkeleton/>
			</>
		}
	</>;
}
