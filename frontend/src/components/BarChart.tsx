import React from "react";
import "./BarChart.scss";

export default class BarChart extends React.Component<{ data: number[] }, { currentValue?: number }> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return <div className={ "bar-chart" } onMouseOver={ () => {
            if (this.state.currentValue !== undefined) this.setState({ currentValue: undefined });
        } } onMouseLeave={ () => {
            if (this.state.currentValue !== undefined) this.setState({ currentValue: undefined });
        } }>
            <div className={ "bars" }>
                { this.props.data.map((height, i) => <div key={ i } className={ "bar" } onMouseOver={ (event) => {
                        event.stopPropagation();
                        if (this.state.currentValue !== height) this.setState({ currentValue: height });
                    } }>
                        <div style={ { height: height + "%" } }></div>
                    </div>
                ) }
            </div>
            <p className={ "caption" }>
                <span style={ { opacity: this.state.currentValue ? 0 : 1 } }>30d ago</span>
                <span style={ { opacity: this.state.currentValue ? 1 : 0 } }>{ this.state.currentValue ?? "" }</span>
                <span style={ { opacity: this.state.currentValue ? 0 : 1 } }>today</span>
            </p>
        </div>
    }
}
