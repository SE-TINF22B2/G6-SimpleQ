import React from "react";
import "./Button.scss";

interface Props {
	style: "primary" | "glass",
	icon: string,
	onClick: () => void,
	children: React.ReactNode,
	disabled?: boolean
}

export default function Button(props: Props) {
	const [isLoading, setIsLoading] = React.useState(false);
	
	return (
		<button className={ "btn btn-" + props.style }
				disabled={ props.disabled || isLoading }
				onClick={ () => {
					if (isLoading) return;
					
					setIsLoading(true);
					props.onClick();
					
					// Todo: Remove this timeout
					setTimeout(() => setIsLoading(false), 1000);
				} }>
			<i className={ isLoading ? "fas fa-spinner" : props.icon }/>
			<span>{ props.children }</span>
		</button>
	);
}
