import React, { useEffect } from "react";
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useParams } from "react-router-dom";
import { AnswerDef, QuestionDef } from "../../../def/QuestionDef";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import QuestionAnswer from "../../../components/question/QuestionAnswer";
import 'react-responsive-modal/styles.css';
import QuestionTitle from "../../../components/question/QuestionTitle";
import Question from "../../../components/question/Question";
import { QuestionSectionTitle } from "../../../components/question/QuestionSectionTitle";
import { QuestionPaginationNext, QuestionPaginationPrev } from "../../../components/question/QuestionPagination";
import QuestionDivider from "../../../components/question/QuestionDivider";
import QuestionAnswerEditor from "../../../components/question/QuestionAnswerEditor";
import ActiveProfileModal from "../../../components/ActiveProfileModal";
import { Session } from "@ory/client";
import AdjustUserContent, { SortByDef, SortDirectionDef } from "../../../components/AdjustUserContent";

const ANSWERS_PAGE_SIZE = 5;

/**
 * The props for the question view
 * @param session is used to determine user type specific features
 * @param setActiveQuestion is a function to update the smart menu
 */
interface Props {
	session?: Session,
	setActiveQuestion: (question?: QuestionDef) => void
}

/**
 * Renders the question view
 * @param props the props for the question view
 */
export default function QuestionView(props: Props) {
	const { id } = useParams();
	const navigate = useNavigate();
	
	const [question, setQuestion] = React.useState<QuestionDef | undefined>(undefined);
	const [answers, setAnswers] = React.useState<AnswerDef[]>([]);
	const [answersLoading, setAnswersLoading] = React.useState(true);
	
	const [sortBy, setSortBy] = React.useState<SortByDef>(SortByDef.ldr);
	const [sortDirection, setSortDirection] = React.useState<SortDirectionDef>(SortDirectionDef.desc);
	const [enableAI, setEnableAI] = React.useState(true);
	
	const [answersPage, setAnswersPage] = React.useState(0);
	
	const [updateQuestion, setUpdateQuestion] = React.useState(false);
	
	const [activeAuthorId, setActiveAuthorId] = React.useState<string | undefined>(undefined);
	
	if (id === undefined) navigate("");
	
	const alert = useAlert();
	
	useEffect(() => {
		global.axios.get("question/" + encodeURIComponent(id ?? ""), { withCredentials: true })
			  .then(res => {
				  let _question: QuestionDef = {
					  answers: res.data.numberOfAnswers ?? 0,
					  author: {
						  id: res.data.author.id ?? "",
						  name: res.data.author.name ?? "Anonymous",
						  type: res.data.author.type ?? "guest"
					  },
					  content: res.data.content ?? "",
					  created: res.data.created ?? "",
					  dislikes: res.data.dislikes ?? 0,
					  id: id ?? "",
					  isDiscussion: res.data.isDiscussion ?? false,
					  likes: res.data.likes ?? 0,
					  opinion: res.data.opinion ?? "none",
					  tags: res.data.tags ?? [],
					  title: res.data.title ?? "",
					  updated: res.data.updated ?? "",
					  isFavorite: res.data.isFavourite ?? false
				  }
				  setQuestion(_question);
			  })
			  .catch(err => axiosError(err, alert));
	}, [alert, id, updateQuestion]);
	
	useEffect(() => {
		question && props.setActiveQuestion(question);
	}, [question, props]);
	
	useEffect(() => {
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
						  author: {
							  id: _answer.author.id ?? "",
							  name: _answer.author.name ?? "Anonymous",
							  type: _answer.author.type ?? "guest"
						  },
					  }
				  });
				  setAnswers(_answers);
			  })
			  .catch(err => axiosError(err, alert))
			  .finally(() => setAnswersLoading(false));
		
	}, [alert, answersPage, enableAI, id, sortBy, sortDirection, updateQuestion]);
	
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
	
	const submitVote = async (_opinion: "like" | "dislike", _id?: string) => {
		if (!question || !id) return;
		
		let __opinion: "like" | "dislike" | "none" = question.opinion === _opinion ? "none" : _opinion;
		
		if (!_id)
			await global.axios.post("question/" + encodeURIComponent(id) + "/vote",
				{ body: _opinion }, { withCredentials: true })
						.then(_ => {
							let likes = question.likes;
							let dislikes = question.dislikes;
							
							if (__opinion === "like") question.likes++;
							else if (__opinion === "dislike") question.dislikes++;
							else if (_opinion === "like") question.likes--;
							else question.dislikes--;
							
							setQuestion({
								...question,
								...{ opinion: __opinion, likes, dislikes }
							});
							alert.success("Vote updated!");
						})
						.catch(err => axiosError(err, alert));
		else
			await global.axios.post("question/" + encodeURIComponent(_id) + "/vote",
				{ body: _opinion }, { withCredentials: true })
						.then(_ => {
							let _answers = answers.map(answer => {
								if (answer.id === _id) {
									answer.opinion = __opinion;
									if (__opinion === "like") answer.likes++;
									else if (__opinion === "dislike") answer.dislikes++;
									else if (_opinion === "like") answer.likes--;
									else answer.dislikes--;
								}
								return answer;
							});
							setAnswers(_answers);
							alert.success("Vote updated!");
						})
						.catch(err => axiosError(err, alert));
	}
	
	return <div className={ "container transparent" }
				style={ { display: "flex", flexDirection: "column", gap: "var(--spacing)", alignItems: "flex-start" } }>
		<ActiveProfileModal activeProfileId={ activeAuthorId } isOwner={ false }
							closeModal={ () => setActiveAuthorId(undefined) }/>
		
		<QuestionTitle session={ props.session }
					   question={ question }
					   toggleFavorite={ toggleFavorite }
					   postVote={ async (vote) => await submitVote(vote) }/>
		
		<hr style={ { margin: 0 } }/>
		
		<Question question={ question } setActiveProfile={ setActiveAuthorId }/>
		
		{ /* <QuestionStats question={ question }/> */ }
		
		{ (question?.answers ?? 1) > 0 && <>
            <QuestionSectionTitle/>
            <QuestionPaginationPrev setAnswersPage={ () => setAnswersPage(answersPage - 1) }
                                    enabled={ answersPage > 0 }
                                    inlineElement={
										<AdjustUserContent sortBy={ sortBy } setSortBy={ setSortBy }
														   sortDirection={ sortDirection }
														   setSortDirection={ setSortDirection }
														   enableAI={ enableAI } setEnableAI={ setEnableAI }/>
									}/>
            <QuestionDivider/>
        </> }
		
		{ !answersLoading
			? answers.map(answer =>
				<QuestionAnswer session={ props.session }
								answer={ answer } key={ answer.id }
								setActiveProfile={ setActiveAuthorId }
								postVote={ async (vote) => await submitVote(vote, answer.id) }/>)
			: <>
				<QuestionAnswer/>
				<QuestionAnswer/>
				<QuestionAnswer/>
			</> }
		
		{ (question?.answers ?? 1) > 0 && <>
            <QuestionDivider/>
            <QuestionPaginationNext setAnswersPage={ () => setAnswersPage(answersPage + 1) }
                                    enabled={ (answersPage + 1) * ANSWERS_PAGE_SIZE < (question?.answers ?? 0) }
                                    inlineElement={
										<p className={ "caption" } style={ { alignSelf: "flex-start" } }>
											Showing
											answers { answersPage * ANSWERS_PAGE_SIZE + 1 } to { (answersPage + 1) * ANSWERS_PAGE_SIZE + " " }
											(page { answersPage + 1 + " " }
											of { Math.ceil((question?.answers ?? 0) / ANSWERS_PAGE_SIZE) })
										</p>
									}/>
        </> }
		
		<QuestionSectionTitle/>
		<QuestionAnswerEditor session={ props.session } onSubmit={ async (content) => {
			let success = false;
			await global.axios.post("question/" + encodeURIComponent(id ?? "") + "/answer",
				{ content }, { withCredentials: true })
						.then(_ => {
							setUpdateQuestion(!updateQuestion);
							success = true;
						})
						.catch(err => axiosError(err, alert));
			return success;
		} }/>
		
		<div style={ { height: "50vh" } }/>
	</div>
}
