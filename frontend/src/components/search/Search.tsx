import "./Search.scss";
import axios, { CancelTokenSource } from "axios";
import { useAlert } from "react-alert";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { axiosError } from "../../def/axios-error";
import Modal from "react-responsive-modal";

let cancelToken: CancelTokenSource;

/**
 * Todo: Do
 * @param props
 * @constructor
 */
export default function Search(props: { isOpen: boolean, closeModal: () => void }) {
	const alert = useAlert();
	const { t } = useTranslation();
	
	const [suggestions, setSuggestions] = useState<any[]>([]);
	
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
				  console.log(res, res.data);
				  setSuggestions(res.data);
			  })
			  .catch(err => {
				  if (err.message.includes('new request')) return;
				  setSuggestions([]);
				  axiosError(err, alert);
			  });
	}
	
	return <Modal open={ props.isOpen } onClose={ props.closeModal }
				  classNames={ {
					  overlay: "modal-overlay",
					  modal: "modal-modal modal-no-padding",
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
			
			<p>{ suggestions.length } suggestions.</p>
		</div>
	</Modal>
}
