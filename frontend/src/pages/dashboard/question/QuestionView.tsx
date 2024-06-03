import React, { useEffect } from "react";
import "./Question.scss";
import Dropdown from "../../../components/dropdown/Dropdown";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useParams } from "react-router-dom";
import SplitSection from "../../../components/section/SplitSection";
import TextEditor from "../../../components/texteditor/TextEditor";
import Button from "../../../components/button/Button";
import { Answer, Question } from "../../../def/Question";
import { formatDate } from "../../../def/converter";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";

/**
 * Renders the question page
 */
export default function QuestionView() {
	const { id } = useParams();
	const navigate = useNavigate();
	
	const [question, setQuestion] = React.useState<Question | undefined>(undefined);
	const [answers, setAnswers] = React.useState<Answer[]>([]);
	const [answersLoading, setAnswersLoading] = React.useState(true);
	const [sortBy, setSortBy] = React.useState<"ldr" | "likes" | "dislikes" | "timestamp">("ldr");
	const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
	const [enableAI, setEnableAI] = React.useState(true);
	
	if (id === undefined) navigate("");
	
	const alert = useAlert();
	
	useEffect(() => {
		global.axios.get("question/" + encodeURIComponent(id ?? ""))
			  .then(res => {
				  let _question: Question = {
					  answers: res.data.numberOfAnswers ?? 0,
					  author: res.data.author ?? undefined,
					  content: res.data.content ?? "",
					  created: formatDate(res.data.created ?? ""),
					  dislikes: res.data.dislikes ?? 0,
					  id: id ?? "",
					  isDiscussion: res.data.isDiscussion ?? false,
					  likes: res.data.likes ?? 0,
					  rating: res.data.rating ?? "none",
					  tags: res.data.tags ?? [],
					  title: res.data.title ?? "",
					  updated: formatDate(res.data.updated ?? "")
				  }
				  setQuestion(_question);
			  })
			  .catch(err => axiosError(err, alert));
		
		global.axios.get("question/" + encodeURIComponent(id ?? "") + "/answers")
			  .then(res => {
				  let _answers: Answer[] = res.data.map((_answer: any) => {
					  return {
						  id: _answer.id ?? "",
						  content: _answer.content ?? "",
						  created: formatDate(_answer.created ?? ""),
						  likes: _answer.likes ?? 0,
						  dislikes: _answer.dislikes ?? 0,
						  rating: "none",
						  author: _answer.author ?? undefined
					  }
				  });
				  setAnswers(_answers);
			  })
			  .catch(err => axiosError(err, alert))
			  .finally(() => setAnswersLoading(false));
	}, [id, navigate, alert]);
	
	const getSortByIcon = () => {
		switch (sortBy) {
			case "ldr":
				return "fi fi-rr-equality";
			case "likes":
				return "fi fi-rr-social-network";
			case "dislikes":
				return "fi fi-rr-social-network flipY";
			case "timestamp":
				return "fi fi-rr-time-past";
		}
	}
	
	const renderAnswer = (answer: Answer, index: number) => {
		return <div key={ index } className={ "container transparent question-answer" }>
			<div className={ "question-answer-author" }
				 style={ {
					 paddingTop: answer.author.type === "ai" ? "var(--spacing)" : 0,
					 paddingInline: answer.author.type === "ai" ? "var(--spacing)" : 0
				 } }>
				{ answer.author.type === "ai" ? <>
					<i className={ "fi fi-sr-brain" }
					   style={ {
						   fontSize: "2em",
						   height: "auto",
						   color: "var(--primary-color)",
						   filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))"
					   } }/>
					
					<p style={ { paddingTop: "calc(var(--spacing) * 0.5)" } }>
						<span>Simp</span>
					</p>
				</> : <div className={ "question-answer-author-user" } tabIndex={ 0 }>
					<img className={ "avatar" } src={ answer.author.id } alt={ "Answer Author" }/>
					
					<p>
						<span>{ answer.author.name }</span>
						<span className={ "badge" }>{ answer.author.type.toUpperCase() }</span>
					</p>
				</div> }
				
				<span className={ "caption" }>replied { answer.created }</span>
			</div>
			
			<div className={ "question-answer-text" }>
				<div className={ "glass" + (answer.author.type === "ai" ? " glass-simp" : "") }>
					<p>{ answer.content }</p>
				</div>
				
				<div className={ "question-answer-actions" }>
					<div
						className={ "question-answer-actions-rate" + (answer.rating === "like" ? " rating" : "") }>
						<i className={ "fi fi-rr-social-network primary-icon" } tabIndex={ 0 }/>
						<span className={ "question-figure" }>{ answer.likes }</span>
						<span className={ "question-unit" }>likes</span>
					</div>
					
					<div
						className={ "question-answer-actions-rate" + (answer.rating === "dislike" ? " rating" : "") }>
						<i className={ "fi fi-rr-social-network flipY primary-icon" } tabIndex={ 0 }/>
						<span className={ "question-figure" }>{ answer.dislikes }</span>
						<span className={ "question-unit" }>dislikes</span>
					</div>
					
					<div style={ { flex: 1 } }/>
					
					<button className={ "question-report" }>
						<i className={ "fi fi-rr-flag" }/>
						Report answer
					</button>
				</div>
			</div>
		</div>
	}
	
	const renderAnswerSkeleton = () => {
		return <div className={ "container transparent question-answer" }>
			<div className={ "question-answer-author" }>
				<Skeleton height={ 40 } width={ 40 }/>
				
				<p>
					<Skeleton height={ 20 } width={ 100 }/>
				</p>
				
				<span className={ "caption" }><Skeleton width={ 60 }/></span>
			</div>
			
			<div className={ "question-answer-text" }>
				<div className={ "glass" }>
					<p>
						<Skeleton count={ 3 }/>
					</p>
				</div>
				
				<div className={ "question-answer-actions" }>
					<Skeleton height={ 20 } width={ 100 }/>
					<Skeleton height={ 20 } width={ 100 }/>
					
					<div style={ { flex: 1 } }/>
					
					<Skeleton height={ 20 } width={ 200 }/>
				</div>
			</div>
		</div>
	}
	
	return <SplitSection className={ "question-main" }>
		<div style={ { display: "flex", flexDirection: "column", gap: "var(--spacing)", flexGrow: 1 } }>
			<section className={ "glass question-content" }>
				{ question ? <p className={ "tags" }>
					{ question.tags.map((tag: string, index: number) =>
						<span key={ index } className={ "badge" }>{ tag }</span>) }
				</p> : <Skeleton className={ "tags" } style={ { width: "60%" } }/> }
				
				<h2 className={ "question-title" }>{ question?.title ?? <Skeleton style={ { width: "200px" } }/> }</h2>
				
				<p>{ question?.content ?? <Skeleton count={ 5 }/> }</p>
				
				<hr/>
				
				{ question ? <span className={ "caption" }>
                        created: { question.created } · last updated: { question.updated }
                    </span> : <Skeleton/> }
				
				{ question && <i className={ "fi fi-rr-star add-favorite" } tabIndex={ 0 }/> }
			</section>
			
			<hr style={ { margin: 0 } }/>
			
			<section className={ "glass focus-indicator" }>
				<h3>Answer this question</h3>
				<TextEditor>
					Write your answer here...
				</TextEditor>
			</section>
			
			<hr style={ { margin: 0 } }/>
			
			{ !answersLoading
				? answers.map((answer, index) => renderAnswer(answer, index))
				: <>
					{ renderAnswerSkeleton() }
					{ renderAnswerSkeleton() }
				</> }
			
			<div style={ {
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-end",
				gap: "var(--spacing)"
			} }>
				<Button icon={ "fi fi-rr-arrow-left" } onClick={ async () => {
				} }>
					Previous
				</Button>
				
				<p>Page 1 of 10</p>
				
				<Button icon={ "fi fi-rr-arrow-right" } onClick={ async () => {
				} } placeIconRight={ true }>
					Next
				</Button>
			</div>
		</div>
		
		<div style={ { display: "flex", flexDirection: "column", gap: "var(--spacing)" } }>
			<section className={ "glass" }>
				<div className={ "question-author" } tabIndex={ 0 }>
					{ question
						? <img className={ "avatar" } src={ question.author.id } alt={ "Question Author" }/>
						: <Skeleton height={ 40 } width={ 40 }/> }
					
					<div className={ "question-author-info" }>
						<span className={ "caption" }>asked by</span>
						
						<p>
							{ question ? <>
								<span>{ question.author.name }</span>
								<span className={ "badge" }>{ question.author.type.toUpperCase() }</span>
							</> : <Skeleton width={ 120 }/> }
						</p>
					</div>
				</div>
				
				<hr style={ { marginBlock: "calc(var(--spacing) / 2)" } }/>
				
				<span className={ "caption" }>Question Stats</span>
				<div className={ "question-stats" }>
					{ question ? <>
						<div className={ "question-stat" }>
							<i className={ "fi fi-rr-eye primary-icon" }/>
							<span
								className={ "question-figure" }>{ "0".replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
							<span className={ "question-unit" }>views</span>
						</div>
						
						<div
							className={ "question-stat" /* + (question.stats.rating === "like" ? " rating" : "") */ }>
							<i className={ "fi fi-rr-social-network primary-icon" } tabIndex={ 0 }/>
							<span
								className={ "question-figure" }>{ question.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
							<span className={ "question-unit" }>likes</span>
						</div>
						
						<div
							className={ "question-stat" /* + (question.stats.rating === "dislike" ? " rating" : "") */ }>
							<i className={ "fi fi-rr-social-network flipY primary-icon" } tabIndex={ 0 }/>
							<span
								className={ "question-figure" }>{ question.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
							<span className={ "question-unit" }>dislikes</span>
						</div>
						
						<div className={ "question-stat" }>
							<i className={ "fi fi-rr-comment-dots primary-icon" }/>
							<span
								className={ "question-figure" }>{ question.answers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
							<span className={ "question-unit" }>answers</span>
						</div>
					</> : <>
						<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
						<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
						<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
						<Skeleton containerClassName={ "question-stat" } width={ 80 }/>
					</> }
				</div>
				
				<hr style={ { marginBottom: "calc(var(--spacing) / 2)" } }/>
				
				<button className={ "question-report" }>
					<i className={ "fi fi-rr-flag" }/>
					Report question
				</button>
			</section>
			
			<Dropdown button={ <Button icon={ "fi fi-rr-filter" }>
				Adjust answers
			</Button> } items={ [
				{
					icon: "fi fi-rr-sort",
					label: "Sort by",
					items: [
						{
							icon: "fi fi-rr-equality",
							label: "Like-Dislike Ratio",
							shortcut: sortBy === "ldr" ?
								<i className={ "fi fi-rr-check" }/> : undefined,
							onClick: () => setSortBy("ldr")
						},
						{
							icon: "fi fi-rr-social-network",
							label: "Most likes",
							shortcut: sortBy === "likes" ?
								<i className={ "fi fi-rr-check" }/> : undefined,
							onClick: () => setSortBy("likes")
						},
						{
							icon: "fi fi-rr-social-network flipY",
							label: "Most dislikes",
							shortcut: sortBy === "dislikes" ?
								<i className={ "fi fi-rr-check" }/> : undefined,
							onClick: () => setSortBy("dislikes")
						},
						{
							icon: "fi fi-rr-time-past",
							label: "Timestamp",
							shortcut: sortBy === "timestamp" ?
								<i className={ "fi fi-rr-check" }/> : undefined,
							onClick: () => setSortBy("timestamp")
						}
					],
					shortcut: <i className={ getSortByIcon() }/>
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
				},
				{
					icon: "fi fi-rr-brain",
					label: "Enable AI",
					shortcut: <input type={ "checkbox" }
									 style={ { userSelect: "none", pointerEvents: "none" } }
									 checked={ enableAI } tabIndex={ -1 }/>,
					onClick: () => setEnableAI(!enableAI)
				}
			] }/>
		</div>
	</SplitSection>
}
