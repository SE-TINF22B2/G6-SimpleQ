import "./ButtonGroup.scss";
import React from "react";

interface Props {
	children?: React.ReactNode[] | React.ReactNode,
	vertical?: boolean,
	style?: React.CSSProperties
}

export default function ButtonGroup(props: Props) {
	let _children = Array.isArray(props.children) ? props.children : [props.children];
	return <div className={ "button-group button-group-" + (props.vertical ? "vertical" : "horizontal") }
				style={ props.style }>
		{ _children.map((child, index) => <div key={ index }>{ child }</div>) }
	</div>
}
