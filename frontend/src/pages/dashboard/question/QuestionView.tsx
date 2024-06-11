import React, { useEffect } from "react";
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useParams } from "react-router-dom";
import { AnswerDef, QuestionDef } from "../../../def/QuestionDef";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import QuestionAnswer from "../../../components/question/QuestionAnswer";
import Dropdown from "../../../components/dropdown/Dropdown";
import Button from "../../../components/button/Button";
import 'react-responsive-modal/styles.css';
import Modal from "react-responsive-modal";
import { ProfileDef } from "../../../def/ProfileDef";
import Skeleton from "react-loading-skeleton";
import Avatar from "../../../components/avatar/Avatar";
import QuestionTitle from "../../../components/question/QuestionTitle";
import Question from "../../../components/question/Question";
import QuestionStats from "../../../components/question/QuestionStats";
import { QuestionSectionTitle } from "../../../components/question/QuestionSectionTitle";
import { QuestionPaginationNext, QuestionPaginationPrev } from "../../../components/question/QuestionPagination";
import QuestionDivider from "../../../components/question/QuestionDivider";
import QuestionAnswerEditor from "../../../components/question/QuestionAnswerEditor";

const ANSWERS_PAGE_SIZE = 5;

/**
 * Renders the question view
 */
export default function QuestionView() {
	const { id } = useParams();
	const navigate = useNavigate();
	
	const [question, setQuestion] = React.useState<QuestionDef | undefined>(undefined);
	const [answers, setAnswers] = React.useState<AnswerDef[]>([]);
	const [answersLoading, setAnswersLoading] = React.useState(true);
	
	const [sortBy, setSortBy] = React.useState<"ldr" | "likes" | "dislikes" | "timestamp">("ldr");
	const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
	const [enableAI, setEnableAI] = React.useState(true);
	
	const [answersPage, setAnswersPage] = React.useState(0);
	
	const [updateQuestion, setUpdateQuestion] = React.useState(false);
	
	const [activeAuthorId, setActiveAuthorId] = React.useState<string | undefined>(undefined);
	
	if (id === undefined) navigate("");
	
	const alert = useAlert();
	
	useEffect(() => {
		global.axios.get("question/" + encodeURIComponent(id ?? ""))
			  .then(res => {
				  let _question: QuestionDef = {
					  answers: res.data.numberOfAnswers ?? 0,
					  author: res.data.author ?? undefined,
					  content: res.data.content ?? "",
					  created: res.data.created ?? "",
					  dislikes: res.data.dislikes ?? 0,
					  id: id ?? "",
					  isDiscussion: res.data.isDiscussion ?? false,
					  likes: res.data.likes ?? 0,
					  opinion: res.data.opinion ?? "none",
					  tags: ["st1", "st2", "st3"],
					  title: res.data.title ?? "",
					  updated: res.data.updated ?? "",
					  isFavorite: res.data.isFavorite ?? false
				  }
				  setQuestion(_question);
			  })
			  .catch(err => axiosError(err, alert));
		
		setAnswersLoading(true);
		global.axios.get("question/" + encodeURIComponent(id ?? "") + "/answers"
			+ "?sortBy=" + encodeURIComponent(sortBy)
			+ "&sortDirection=" + encodeURIComponent(sortDirection)
			+ "&enableAI=" + encodeURIComponent(enableAI)
			+ "&limit=" + encodeURIComponent(ANSWERS_PAGE_SIZE)
			+ "&offset=" + encodeURIComponent(answersPage * ANSWERS_PAGE_SIZE))
			  .then(res => {
				  let _answers: AnswerDef[] = res.data.map((_answer: any) => {
					  return {
						  id: _answer.id ?? "",
						  content: _answer.content ?? "",
						  created: _answer.created ?? "",
						  likes: _answer.likes ?? 0,
						  dislikes: _answer.dislikes ?? 0,
						  opinion: "none",
						  author: _answer.author ?? undefined
					  }
				  });
				  setAnswers(_answers);
			  })
			  .catch(err => axiosError(err, alert))
			  .finally(() => setAnswersLoading(false));
	}, [id, navigate, alert, updateQuestion, sortBy, sortDirection, enableAI, answersPage]);
	
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
	
	const toggleFavorite = async () => {
		if (!question) return;
		
		if (question.isFavorite)
			await global.axios.delete("favourites/" + id, { withCredentials: true })
						.then(_ => setQuestion({ ...question, ...{ isFavorite: false } }))
						.catch(err => axiosError(err, alert));
		else
			await global.axios.post("favourites/" + id, {}, { withCredentials: true })
						.then(_ => setQuestion({ ...question, ...{ isFavorite: true } }))
						.catch(err => axiosError(err, alert));
	}
	
	return <div className={ "container transparent" }
				style={ { display: "flex", flexDirection: "column", gap: "var(--spacing)", alignItems: "flex-start" } }>
		<ActiveProfileModal activeProfileId={ activeAuthorId } closeModal={ () => setActiveAuthorId(undefined) }/>
		
		<QuestionTitle question={ question }
					   toggleFavorite={ toggleFavorite }/>
		
		<hr style={ { margin: 0 } }/>
		
		<Question question={ question } setActiveProfile={ setActiveAuthorId }/>
		
		<QuestionStats question={ question }/>
		
		<QuestionSectionTitle/>
		<QuestionPaginationPrev setAnswersPage={ () => setAnswersPage(answersPage - 1) }
								enabled={ answersPage > 0 }
								inlineElement={
									<Dropdown button={ <Button icon={ "fi fi-rr-filter" }>
										Adjust answers
									</Button> }
											  direction={ "left" }
											  items={ [
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
																	   style={ {
																		   userSelect: "none",
																		   pointerEvents: "none"
																	   } }
																	   checked={ enableAI } tabIndex={ -1 }/>,
													  onClick: () => setEnableAI(!enableAI)
												  }
											  ] }/>
								}/>
		<QuestionDivider/>
		
		{ !answersLoading
			? answers.map((answer, index) =>
				<QuestionAnswer answer={ answer } key={ index }
								setActiveProfile={ setActiveAuthorId }/>)
			: <>
				<QuestionAnswer/>
				<QuestionAnswer/>
				<QuestionAnswer/>
			</> }
		
		<QuestionDivider/>
		<QuestionPaginationNext setAnswersPage={ () => setAnswersPage(answersPage + 1) }
								enabled={ (answersPage + 1) * ANSWERS_PAGE_SIZE < (question?.answers ?? 0) }
								inlineElement={
									<p>
										Showing page { answersPage + 1 + " " }
										of { Math.ceil((question?.answers ?? 0) / ANSWERS_PAGE_SIZE) }
									</p>
								}/>
		
		<QuestionSectionTitle/>
		<QuestionAnswerEditor onSubmit={ async (content) => {
			await global.axios.post("question/" + encodeURIComponent(id ?? "") + "/answer",
				{ content }, { withCredentials: true })
						.then(_ => {
							setUpdateQuestion(!updateQuestion);
							alert.success("Answer created!");
						})
						.catch(err => axiosError(err, alert));
		} }/>
		
		<div style={ { height: "50vh" } }/>
	</div>
}

/**
 * Renders a modal providing relevant information about a given user
 * @param props.activeProfileId the id of the user profile, used for the fetch, may be undefined to close modal
 * @param props.closeModal callback function of closing the modal
 */
function ActiveProfileModal(props: { activeProfileId: string | undefined, closeModal: () => void }) {
	const alert = useAlert();
	
	const [activeProfile, setActiveProfile] = React.useState<ProfileDef | undefined>(undefined);
	
	useEffect(() => {
		if (!props.activeProfileId) return;
		
		setActiveProfile(undefined);
		
		global.axios.get<ProfileDef>("profile/" + props.activeProfileId)
			  .then(res => setActiveProfile(res.data))
			  .catch(err => axiosError(err, alert));
	}, [alert, props.activeProfileId]);
	
	return <Modal open={ props.activeProfileId !== undefined } onClose={ props.closeModal }
				  classNames={ { modal: "modal-modal", closeButton: "modal-close" } } center>
		<div style={ { width: "100%", display: "grid", placeItems: "center" } }>
			{ activeProfile
				? <Avatar style={ { height: 100, width: 100 } }/>
				: <Skeleton height={ 100 } width={ 100 }/>
			}
			<h1>{ activeProfile?.name ?? <Skeleton width={ 200 }/> }</h1>
		</div>
	</Modal>
}
