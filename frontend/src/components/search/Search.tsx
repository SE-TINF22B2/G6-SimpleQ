import "./Search.scss";
import axios, { CancelTokenSource } from "axios";
import { useAlert } from "react-alert";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { axiosError } from "../../def/axios-error";

let cancelToken: CancelTokenSource;

export default function Search(props: { toggleSearch: () => void }) {
	const alert = useAlert();
	const { t } = useTranslation();
	
	const [suggestions, setSuggestions] = useState<any[]>([]);
	
	const updateSuggestions = (query: string) => {
		if (cancelToken) cancelToken.cancel("Operation canceled due to new request.");
		cancelToken = axios.CancelToken.source();
		
		global.axios.get("question/search", {
			params: {
				q: query
			},
			cancelToken: cancelToken.token
		})
			  .then(res => {
				  setSuggestions(res.data);
			  })
			  .catch(err => {
				  if (err.message.includes('new request')) return;
				  setSuggestions([]);
				  axiosError(err, alert);
			  });
	}
	
	return <div className={ "search glass" }
				onClick={ props.toggleSearch }
				onBlur={ (e: any) => {
					let isFocusWithin = e.currentTarget.contains(e.relatedTarget);
					if (!isFocusWithin) props.toggleSearch();
				} }>
		<div className={ "search-container" }>
			<div onClick={ (e: any) => e.stopPropagation() }>
				<i className={ "fi fi-rr-search" }/>
				<input type={ "text" } placeholder={ t('dashboard.search.search') } onInput={ e => {
					const value = (e.target as HTMLInputElement).value.trim();
					if (value.length > 0) updateSuggestions(value);
					else setSuggestions([]);
				} }/>
			</div>
			
			<p className={ "search-info" }>
				{ t('dashboard.search.info') }
			</p>
			
			<p className={ "search-result" } tabIndex={ 0 }>
				<i className={ "fi fi-rr-question badge" }/>
				<span>How to use React? - { suggestions.length }</span>
				<i className={ "fi fi-rr-user" }
				   style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
				<span>Benni Loidl</span>
				<span>Yesterday</span>
			</p>
		</div>
	</div>
}
