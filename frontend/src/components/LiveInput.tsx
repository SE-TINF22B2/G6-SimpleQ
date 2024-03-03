import React from "react";
import "./LiveInput.scss";

interface Props {
    onSuggestionSelected?: (suggestion: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default class LiveInput extends React.Component<Props, { suggestions: string[] }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            suggestions: []
        }
    }

    render() {
        return <div className={ "live-input" }>
            <input type={ "text" } disabled={ this.props.disabled }
                   placeholder={ this.props.placeholder ?? "" }
                   onChange={ (event) => {
                       const input = event.target.value;
                       if (input.length > 0) {
                           this.setState({ suggestions: [input] });
                       } else {
                           this.setState({ suggestions: [] });
                       }
                   } }/>
            <div className={ "suggestions" }>
                { this.state.suggestions.length > 0
                    ? this.state.suggestions.map((suggestion, index) =>
                        <button key={ index }
                                onClick={ (event) => {
                                    if (this.props.onSuggestionSelected) {
                                        this.props.onSuggestionSelected(suggestion);

                                        let input = (event.target as HTMLButtonElement).parentElement?.parentElement?.querySelector("input");
                                        if (input) input.value = "";
                                        this.setState({ suggestions: [] });

                                        (event.target as HTMLButtonElement).blur();
                                    }
                                } }>
                            { suggestion }
                        </button>)
                    : <button disabled>Please start typing</button> }
            </div>
        </div>
    }
}
