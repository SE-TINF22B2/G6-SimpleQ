import React, { CSSProperties } from "react";
import "./Button.scss";
import { animateBlob } from "../../def/cool-blobs";

interface Props {
	buttonStyle?: "primary" | "glass",
	icon?: string,
	onClick?: () => Promise<void>,
	children?: React.ReactNode,
	disabled?: boolean,
	placeIconRight?: boolean,
	type?: "button" | "reset" | "submit",
	className?: string,
	style?: CSSProperties,
	iconStyle?: CSSProperties
}

/**
 * Renders a button
 * @param props.buttonStyle style of the button, default is "glass"
 * @param props.icon icon of the button, optional
 * @param props.onClick() function to be executed once the button is pressed
 * @param props.children ReactNode as child of the button, automatically wrapped in <span></span>, used to render a text inside the button
 * @param props.disabled optionally disable clicking the button
 * @param props.placeIconRight optionally change the icon placement to the right side of the button
 * @param props.type optionally set the html button type
 * @param props.className optionally add classes to the button
 * @param props.style optionally add custom inline styles for the whole button component
 * @param props.iconStyle optionally add custom inline styles for the icon
 * */
export default function Button(props: Props) {
	const [isLoading, setIsLoading] = React.useState(false);
	
	return (
		<button className={
			"btn btn-" + (props.buttonStyle ?? "glass") + (props.className ? " " + props.className : "")
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
			{ props.icon && !props.placeIconRight && <i className={ isLoading ? "fi fi-rr-spinner spin" : props.icon }
                                                        style={ { ...{ marginLeft: "calc(var(--spacing) * -0.75)" }, ...props.iconStyle } }/> }
			<span>{ props.children }</span>
			{ props.icon && props.placeIconRight && <i className={ isLoading ? "fi fi-rr-spinner spin" : props.icon }
                                                       style={ { ...{ marginRight: "calc(var(--spacing) * -0.75)" }, ...props.iconStyle } }/> }
			
			<span className={ "button-blob" }/>
		</button>
	);
}
