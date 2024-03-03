import React from "react";
import "./LiveInput.scss";

interface Props {
    placeholder?: string;
}

export default class LiveInput extends React.Component<Props, any> {
    render() {
        return <div className={ "live-input" }>
            <input type={ "text" } placeholder={ this.props.placeholder ?? "" }/>
            <div className={ "suggestions" }>
                <button>Test</button>
                <button>Test</button>
                <button>Test</button>
                <button>Test</button>
                <button>Test</button>
            </div>
        </div>
    }
}
