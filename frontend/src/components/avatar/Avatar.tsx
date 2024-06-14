import "./Avatar.scss";
import React, { CSSProperties } from "react";
import noUser from "../../images/no-user.svg";

export default function Avatar(props: { userName?: string, style?: CSSProperties }) {
	if (props.userName)
		return <div className={ "avatar" }
					style={ props.style }>
			<p>{ props.userName.substring(0, 2).toUpperCase() }</p>
		</div>
	
	return <img className={ "avatar" }
				style={ props.style }
				src={ "" }
				alt={ "Avatar" }
				onError={ ({ currentTarget }) => {
					currentTarget.onerror = null; // prevents looping
					currentTarget.src = noUser;
					currentTarget.style.padding = "calc(var(--spacing) / 2)";
					currentTarget.style.background = "var(--background-color-primary)";
				} }/>
}
