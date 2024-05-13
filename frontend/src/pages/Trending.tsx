import React from "react";
import "./Trending.scss";
import Dropdown from "../components/dropdown/Dropdown";
import { NavigateFunction } from "react-router-dom";
import thinking from "../illustrations/thinking.svg";
import LiveInput from "../components/LiveInput";
import QuestionPreview from "../structs/QuestionPreview";
import QuestionPreviewSkeleton from "../structs/QuestionPreviewSkeleton";
import Section from "../components/Section";

interface State {
	questions?: QuestionElem[];
	sortBy: "timestamp";
	sortDirection: "asc" | "desc";
}

export interface QuestionElem {
	id: number;
	isDiscussion: boolean;
	title: string;
	originalLanguage: string;
	creationDate: string;
	updateDate: string;
	tags: string[];
	stats: {
		likes: number;
		dislikes: number;
		views: number;
		answers: number;
		rating: "like" | "dislike" | "none";
	}
	author: {
		name: string;
		avatar: string;
	};
}

export default class Trending extends React.Component<{ navigate: NavigateFunction }, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			sortBy: "timestamp",
			sortDirection: "desc"
		};
	}
	
	componentDidMount() {
		setTimeout(() => this.setState({
			questions: [
				{
					id: 1,
					isDiscussion: false,
					title: "How to rescue water damaged iPhone 12?",
					originalLanguage: "English",
					creationDate: "20.10.2023",
					updateDate: "today",
					tags: ["Smartphone", "Technical Support", "iPhone"],
					stats: {
						views: 51,
						likes: 7,
						dislikes: 3,
						answers: 2,
						rating: "like"
					},
					author: {
						name: "John Doe",
						avatar: "https://www.w3schools.com/w3images/avatar2.png"
					}
				},
				{
					id: 2,
					isDiscussion: true,
					title: "What is the best way to learn React?",
					originalLanguage: "ENGLISH",
					creationDate: "20.10.2023",
					updateDate: "TODAY",
					tags: ["Tag 1", "Tag 2", "Tag 3"],
					stats: {
						likes: 123,
						dislikes: 5122,
						views: 13412,
						answers: 202,
						rating: "none"
					},
					author: {
						name: "John Doe",
						avatar: "https://www.w3schools.com/w3images/avatar2.png"
					}
				},
				{
					id: 3,
					isDiscussion: false,
					title: "How can I improve my CSS skills?",
					originalLanguage: "ENGLISH",
					creationDate: "20.10.2023",
					updateDate: "TODAY",
					tags: ["Tag 1", "Tag 2", "Tag 3"],
					stats: {
						likes: 124231,
						dislikes: 123,
						views: 12161353,
						answers: 12412,
						rating: "dislike"
					},
					author: {
						name: "John Doe",
						avatar: "https://www.w3schools.com/w3images/avatar2.png"
					}
				}
			]
		}), 1000);
	}
	
	render() {
		return <>
			<Section className={ "trending-header" }>
				<div style={ { display: "flex", gap: "var(--spacing)" } }>
					<div style={ { flex: 1 } }>
						<h1>
							<i className={ "fas fa-chart-line" }/>
							Trending
						</h1>
						<p>See what's trending on our platform.</p>
						
						<div style={ {
							display: "flex",
							gap: "var(--spacing)",
							alignItems: "center",
							marginTop: "var(--spacing)"
						} }>
							<Dropdown button={ <p className={ "btn btn-glass" } tabIndex={ 0 }>
								<i className={ "fas fa-filter" }/>
								Adjust questions
							</p> } items={ [
								{
									icon: "fas fa-sort",
									label: "Sort by",
									items: [
										{
											icon: "fas fa-clock-rotate-left",
											label: "Timestamp",
											shortcut: this.state.sortBy === "timestamp" ?
												<i className={ "fas fa-check" }/> : undefined,
											onClick: () => this.setState({ sortBy: "timestamp" })
										}
									],
									shortcut: <i className={ "fas fa-clock-rotate-left" }/>
								},
								{
									icon: "fas fa-sort-amount-down",
									label: "Direction",
									items: [
										{
											icon: "fas fa-arrow-trend-up",
											label: "Ascending",
											shortcut: this.state.sortDirection === "asc" ?
												<i className={ "fas fa-check" }/> : undefined,
											onClick: () => this.setState({ sortDirection: "asc" })
										},
										{
											icon: "fas fa-arrow-trend-down",
											label: "Descending",
											shortcut: this.state.sortDirection === "desc" ?
												<i className={ "fas fa-check" }/> : undefined,
											onClick: () => this.setState({ sortDirection: "desc" })
										}
									],
									shortcut: <i
										className={ "fas fa-arrow-trend-" + (this.state.sortDirection === "asc" ? "up" : "down") }/>
								}
							] } direction={ "right" }/>
							
							<LiveInput placeholder={ "Filter tags" }/>
						</div>
					</div>
					
					<img src={ thinking }
						 style={ { height: "120px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
				</div>
				
				<hr/>
				<p className={ "tags tags-deletable" }>
					<span className={ "badge" } tabIndex={ 0 }>Smartphone</span>
					<span className={ "badge" } tabIndex={ 0 }>iPhone</span>
					<span className={ "badge" } tabIndex={ 0 }>Tag 1</span>
				</p>
			</Section>
			
			{ this.state.questions
				? this.state.questions.map((question, index) =>
					<QuestionPreview question={ question } index={ index }/>)
				: <>
					<QuestionPreviewSkeleton/>
					<QuestionPreviewSkeleton/>
					<QuestionPreviewSkeleton/>
				</>
			}
		</>;
	}
}
