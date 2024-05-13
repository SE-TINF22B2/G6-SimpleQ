import React from "react";
import "./LiveInput.scss";
import { useTranslation } from "react-i18next";

interface Props {
	onSuggestionSelected?: (suggestion: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

export default function LiveInput(props: Props) {
	const { t } = useTranslation();
	const [suggestions, setSuggestions] = React.useState<string[]>([]);
	
	return <div className={ "live-input" }>
		<input type={ "text" } disabled={ props.disabled }
			   placeholder={ props.placeholder ?? "" }
			   onChange={ (event) => {
				   const input = event.target.value;
				   if (input.length > 0) setSuggestions([input]);
				   else setSuggestions([]);
			   } }/>
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
