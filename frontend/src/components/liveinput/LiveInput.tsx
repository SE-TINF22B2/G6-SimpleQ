import React, { useState } from "react";
import "./LiveInput.scss";
import { useTranslation } from "react-i18next";
import axios, { CancelTokenSource } from "axios";
import { useAlert } from "react-alert";

let cancelToken: CancelTokenSource;

interface Props {
	onSuggestionSelected?: (suggestion: string) => void;
	placeholder?: string;
	disabled?: boolean;
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
				  alert.show(err.message, { type: "error" });
			  })
			  .finally(() => setIsLoading(false));
	}
	
	return <div className={ "live-input" }>
		<input type={ "text" } disabled={ props.disabled }
			   placeholder={ props.placeholder ?? "" }
			   onChange={ (event) => {
				   const input = event.target.value;
				   updateSuggestions(input);
			   } }/>
		
		{ isLoading && <i className={ "fi fi-rr-spinner spin" }/> }
		
		<div className={ "suggestions" }>
			{ suggestions.length > 0
				? suggestions.map((suggestion, index) =>
					<button key={ index }
							onClick={ (event) => {
								if (props.onSuggestionSelected) {
									props.onSuggestionSelected(suggestion);
									
									let input = (event.target as HTMLButtonElement).parentElement?.parentElement?.querySelector("input");
									if (input) input.value = "";
									setSuggestions([]);
									
									(event.target as HTMLButtonElement).blur();
								}
							} }>
						{ suggestion }
					</button>)
				: <button disabled>{ t('components.liveInput.empty') }</button> }
		</div>
	</div>
}
