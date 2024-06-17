import "./Search.scss";
import axios, { CancelTokenSource } from "axios";
import { useAlert } from "react-alert";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { axiosError } from "../../def/axios-error";
import Modal from "react-responsive-modal";
import { parseQuestion, QuestionDef } from "../../def/QuestionDef";
import Avatar from "../avatar/Avatar";
import { formatDate } from "../../def/converter";
import { useNavigate } from "react-router-dom";

let cancelToken: CancelTokenSource;

/**
 * Todo: Do
 * @param props
 * @constructor
 */
export default function Search(props: { isOpen: boolean, closeModal: () => void }) {
	const alert = useAlert();
	const navigate = useNavigate();
	const { t } = useTranslation();
	
	const [suggestions, setSuggestions] = useState<QuestionDef[]>([]);
	
	const updateSuggestions = (query: string) => {
		if (cancelToken) cancelToken.cancel("Operation canceled due to new request.");
		cancelToken = axios.CancelToken.source();
		
		global.axios.get<any>("question/search", {
			params: {
				q: query
			},
			cancelToken: cancelToken.token
		})
			  .then(res => {
				  let _suggestions: QuestionDef[] = [];
				  res.data.forEach((_question: any) => _suggestions.push(parseQuestion(_question)));
				  setSuggestions(_suggestions);
			  })
			  .catch(err => {
				  if (err.message.includes('new request')) return;
				  setSuggestions([]);
				  axiosError(err, alert);
			  });
	}
	
	useEffect(() => {
		setSuggestions([]);
	}, [props.isOpen]);
	
	return <Modal open={ props.isOpen } onClose={ props.closeModal }
				  classNames={ {
					  overlay: "modal-overlay",
					  modal: "modal-modal modal-no-padding search",
					  closeButton: "modal-close"
				  } }
				  styles={ { modal: { marginTop: "var(--spacing)" } } }>
		<div style={ { width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" } }>
			<input type={ "text" } placeholder={ t('dashboard.search.search') }
				   style={ {
					   padding: "var(--spacing)",
					   paddingRight: "calc(var(--spacing) * 3)",
					   borderRadius: "var(--border-radius) var(--border-radius) 0 0",
					   border: "none",
					   background: "var(--background-color-primary)",
					   fontSize: "2em",
					   fontWeight: 700
				   } }
				   onInput={ e => {
					   const value = (e.target as HTMLInputElement).value.trim();
					   if (value.length > 0) updateSuggestions(value);
					   else setSuggestions([]);
				   } }
				   spellCheck={ false }/>
			
			<div style={ { height: "var(--outline-width)" } }/>
			
			<p style={ { textAlign: "center", background: "var(--background-color-primary)" } }>
				<span className={ "caption" }>{ t('dashboard.search.info') }</span>
			</p>
			
			{ suggestions.map((suggestion, i) =>
				<div key={ i } className={ "suggestion" } tabIndex={ 0 }
					 onClick={ () => {
						 navigate("/dashboard/question/" + suggestion.id);
						 props.closeModal();
					 } }
					 onKeyDown={ (e: any) => {
						 if (e.key !== "Enter") return;
						 navigate("/dashboard/question/" + suggestion.id);
						 props.closeModal();
					 } }>
					<div className={ "suggestion-main" }>
						<div className={ "suggestion-title" }>
							<h2>{ suggestion.title }</h2>
							{ suggestion.tags.map((tag, index) => <p className={ "badge" } key={ index }>{ tag }</p>) }
						</div>
						<p className={ "caption suggestion-caption" }>
						<span>
							<i className={ suggestion.isDiscussion ? "fi fi-rr-comments-question" : "fi fi-rr-interrogation" }/>
							{ suggestion.isDiscussion
								? t('components.question.type.discussion')
								: t('components.question.type.question')
							}
						</span>
							<span>·</span>
							<span>
							<i className={ "fi fi-rr-clock" }/>
								{ formatDate(suggestion.created) }
						</span>
							<span>·</span>
							<span>
							<i className={ "fi fi-rr-refresh" }/>
								{ formatDate(suggestion.updated) }
						</span>
							<span>·</span>
							<span>
							<i className={ "fi fi-rr-social-network" }/>
								{ suggestion.likes }
						</span>
							<span>·</span>
							<span>
							<i className={ "fi fi-rr-social-network flipY" }/>
								{ suggestion.dislikes }
						</span>
						</p>
					</div>
					
					<Avatar userName={ suggestion.author.name }/>
				</div>
			) }
		</div>
	</Modal>
}
