import "./Search.scss";
import axios, { CancelTokenSource } from "axios";
import { useAlert } from "react-alert";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { axiosError } from "../../def/axios-error";
import Modal from "react-responsive-modal";
import { QuestionDef } from "../../def/QuestionDef";
import Avatar from "../avatar/Avatar";
import { formatDate } from "../../def/converter";

let cancelToken: CancelTokenSource;

/**
 * Todo: Do
 * @param props
 * @constructor
 */
export default function Search(props: { isOpen: boolean, closeModal: () => void }) {
	const alert = useAlert();
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
				  res.data.forEach((_question: any) => _suggestions.push({
					  answers: 0,
					  author: {
						  id: "def",
						  name: "anonymous",
						  type: "guest"
					  },
					  created: "0",
					  dislikes: _question.dislikes ?? 0,
					  id: "abc",
					  isDiscussion: false,
					  isFavorite: false,
					  likes: _question.likes ?? 0,
					  opinion: "none",
					  tags: ["tag1", "tag2"],
					  title: "title",
					  updated: "0"
				  }));
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
			
			{ suggestions.map((suggestion, i) => <div key={ i } className={ "suggestion" } tabIndex={ 0 }>
				<div className={ "suggestion-main" }>
					<div className={ "suggestion-title" }>
						{ suggestion.isDiscussion
							? <span className={ "badge badge-outline" }>
									<i className={ "fi fi-rr-comments-question" }
									   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
									Discussion
							</span>
							: <span className={ "badge badge-outline" }>
									<i className={ "fi fi-rr-interrogation" }
									   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
									Question
								</span>
						}
						<span className={ "suggestion-title-divider" }/>
						<h2>{ suggestion.title }</h2>
						<p className={ "badge" }>Tag2</p>
					</div>
					<p className={ "caption suggestion-caption" }>
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
				
				<Avatar/>
			</div>) }
		</div>
	</Modal>
}
