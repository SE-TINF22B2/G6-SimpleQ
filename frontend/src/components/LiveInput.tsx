import React from "react";
import "./LiveInput.scss";

export default class LiveInput extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className={ "live-input" }>
            <input type={ "text" }/>
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
