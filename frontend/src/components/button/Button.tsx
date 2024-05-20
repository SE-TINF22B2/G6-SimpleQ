import React from "react";
import "./Button.scss";

interface Props {
	style?: "primary" | "glass",
	icon?: string,
	onClick?: () => void,
	children?: React.ReactNode,
	disabled?: boolean,
	placeIconRight?: boolean
}

export default function Button(props: Props) {
	const [isLoading, setIsLoading] = React.useState(false);
	
	return (
		<button className={ "btn btn-" + (props.style ?? "glass") }
				disabled={ props.disabled || isLoading }
				onClick={ () => {
					if (!props.onClick) return;
					if (isLoading) return;
					
					setIsLoading(true);
					props.onClick();
					
					setIsLoading(false);
				} }>
			{ props.icon && !props.placeIconRight && <i className={ isLoading ? "fas fa-spinner fa-spin" : props.icon }
                                                        style={ { marginRight: "var(--spacing)" } }/> }
			<span>{ props.children }</span>
			{ props.icon && props.placeIconRight && <i className={ isLoading ? "fas fa-spinner fa-spin" : props.icon }
                                                       style={ { marginLeft: "var(--spacing)" } }/> }
		</button>
	);
}
