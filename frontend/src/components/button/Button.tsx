import React from "react";
import "./Button.scss";

interface Props {
	buttonStyle?: "primary" | "glass",
	icon?: string,
	onClick?: () => Promise<void>,
	children?: React.ReactNode,
	disabled?: boolean,
	placeIconRight?: boolean
}

/**
 * Renders a button
 * @param props.buttonStyle style of the button, default is "glass"
 * @param props.icon icon of the button, optional
 * @param props.onClick() function to be executed once the button is pressed
 * @param props.children ReactNode as child of the button, automatically wrapped in <span></span>, used to render a text inside the button
 * @param props.disabled optionally disable clicking the button
 * @param props.placeIconRight optionally change the icon placement to the right side of the button
 * */
export default function Button(props: Props) {
	const [isLoading, setIsLoading] = React.useState(false);
	
	return (
		<button className={ "btn btn-" + (props.buttonStyle ?? "glass") }
				disabled={ props.disabled || isLoading }
				onClick={ async () => {
					if (!props.onClick) return;
					if (isLoading) return;
					
					setIsLoading(true);
					await props.onClick();
					
					setIsLoading(false);
				} }>
			{ props.icon && !props.placeIconRight && <i className={ isLoading ? "fi fi-rr-spinner spin" : props.icon }
                                                        style={ { marginRight: "var(--spacing)" } }/> }
			<span>{ props.children }</span>
			{ props.icon && props.placeIconRight && <i className={ isLoading ? "fi fi-rr-spinner spin" : props.icon }
                                                       style={ { marginLeft: "var(--spacing)" } }/> }
		</button>
	);
}
