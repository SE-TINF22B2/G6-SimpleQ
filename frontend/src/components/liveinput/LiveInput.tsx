import React, { useState } from "react";
import "./LiveInput.scss";
import { useTranslation } from "react-i18next";
import axios, { CancelTokenSource } from "axios";
import { useAlert } from "react-alert";
import { axiosError } from "../../def/axios-error";

let cancelToken: CancelTokenSource;

interface Props {
	onSuggestionSelected?: (suggestion: string) => void;
	placeholder?: string;
	disabled?: boolean;
	
	selectedSuggestions?: string[];
	onSuggestionDeselected?: (suggestion: string) => void;
}

/**
 * Renders a live input that shows selectable suggestions based on the input text
 * @param props.onSuggestionSelected Optional function to be executed once a suggestion is selected
 * @param props.placeholder Optional string to be displayed as an input placeholder
 * @param props.disabled Optional boolean to disable the live input
 */
export default function LiveInput(props: Props) {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);
	const [suggestions, setSuggestions] = React.useState<string[]>([]);
	const [input, setInput] = React.useState<HTMLInputElement | null>();
	
	const alert = useAlert();
	
	const updateSuggestions = (input: string) => {
		setIsLoading(true);
		
		if (cancelToken) cancelToken.cancel("Operation canceled due to new request.");
		
		cancelToken = axios.CancelToken.source();
		
		global.axios.get("tags/find?tag=" + encodeURIComponent(input.toLowerCase()), { cancelToken: cancelToken.token })
			  .then(res => {
				  let tags = res.data.tags;
				  if (!tags.includes(input.toLowerCase()) && input.trim().length > 0)
					  tags.push(input.toLowerCase());
				  setSuggestions(tags);
			  })
			  .catch(err => {
				  if (err.message.includes('new request')) return;
				  setSuggestions([]);
				  axiosError(err, alert);
			  })
			  .finally(() => setIsLoading(false));
	}
	
	let renderedSelectedSuggestions = (props.selectedSuggestions ?? [])
		.filter(s => s.includes(input?.value.toLowerCase() ?? ""));
	
	let renderedSuggestions = props.disabled ? [] : suggestions.filter(s => !props.selectedSuggestions?.includes(s));
	
	return <div className={ "live-input" }>
		<input type={ "text" } ref={ i => setInput(i) }
			   placeholder={ props.placeholder ?? "" }
			   onChange={ (event) => {
				   const input = event.target.value;
				   updateSuggestions(input);
			   } }/>
		
		<p className={ "selection-count" }>{ (props.selectedSuggestions ?? []).length }</p>
		
		{ <i className={ "fi fi-rr-" + (isLoading ? "spinner spin" : "filter") + " selection-activity" }/> }
		
		<div className={ "suggestions" }>
			{ renderedSelectedSuggestions.length === 0 && renderedSuggestions.length === 0
				&& <p className={ "caption" }>{ t('components.liveInput.empty') }</p> }
			
			{ renderedSelectedSuggestions.length > 0 && <>
                <span className={ "caption" }>{ t('components.liveInput.selected') }</span>
				
				{ renderedSelectedSuggestions.map((suggestion, index) =>
					<button key={ index } onClick={ _ => {
						input?.focus();
						
						if (props.onSuggestionDeselected)
							props.onSuggestionDeselected(suggestion.toLowerCase());
					} }>
						<i className={ "fi fi-rr-check" } style={ { color: "var(--primary-color)" } }/>{ suggestion }
					</button>
				) }
            </> }
			
			{ renderedSelectedSuggestions.length > 0 && renderedSuggestions.length > 0 && <hr/> }
			
			{ renderedSuggestions.length > 0 && <>
                <span className={ "caption" }>{ t('components.liveInput.suggestions') }</span>
				
				{ renderedSuggestions.map((suggestion, index) =>
					<button key={ index }
							onClick={ _ => {
								input?.focus();
								
								if (props.onSuggestionSelected)
									props.onSuggestionSelected(suggestion.toLowerCase());
							} }>
						<i className={ "fi fi-rr-plus" }/>
						{ suggestion }
					</button>) }
            </> }
		</div>
	</div>
}
