import React, { CSSProperties } from "react";
import "./Button.scss";
import { animateBlob } from "../../def/cool-blobs";

interface Props {
	buttonStyle?: "primary" | "glass",
	slim?: boolean,
	iconLeft?: string,
	iconLeftStyle?: CSSProperties,
	iconRight?: string,
	iconRightStyle?: CSSProperties,
	onClick?: () => Promise<void>,
	children?: React.ReactNode,
	disabled?: boolean,
	type?: "button" | "reset" | "submit",
	className?: string,
	style?: CSSProperties
}

/**
 * Renders a button
 * @param props.buttonStyle style of the button, default is "glass"
 * @param props.slim make the button slim
 * @param props.iconLeft left icon of the button, optional
 * @param props.iconLeftStyle optionally add custom inline styles for the left icon
 * @param props.iconRight right icon of the button, optional
 * @param props.iconRightStyle optionally add custom inline styles for the right icon
 * @param props.onClick() function to be executed once the button is pressed
 * @param props.children ReactNode as child of the button, automatically wrapped in <span></span>, used to render a text inside the button
 * @param props.disabled optionally disable clicking the button
 * @param props.type optionally set the html button type
 * @param props.className optionally add classes to the button
 * @param props.style optionally add custom inline styles for the whole button component
 * */
export default function Button(props: Props) {
	const [isLoading, setIsLoading] = React.useState(false);
	
	return (
		<button className={
			"btn btn-" +
			(props.buttonStyle ?? "glass") +
			(props.className ? " " + props.className : "") +
			(props.slim ? " btn-slim" : "")
		}
				style={ props.style }
				type={ props.type }
				disabled={ props.disabled || isLoading }
				onClick={ async (e) => {
					animateBlob(e);
					
					if (!props.onClick) return;
					if (isLoading) return;
					
					setIsLoading(true);
					await props.onClick();
					
					setIsLoading(false);
				} }>
			{ props.iconLeft && <i className={ isLoading ? "fi fi-rr-spinner spin" : props.iconLeft }
                                   style={ { ...{ marginLeft: "calc(var(--spacing) * -1)" }, ...props.iconLeftStyle } }/> }
			<span>{ props.children }</span>
			{ props.iconRight && <i className={ isLoading ? "fi fi-rr-spinner spin" : props.iconRight }
                                    style={ { ...{ marginRight: "calc(var(--spacing) * -1)" }, ...props.iconRightStyle } }/> }
			
			<span className={ "button-blob" }/>
		</button>
	);
}
