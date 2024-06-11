import "./Avatar.scss";
import React, { CSSProperties } from "react";

export default function Avatar(props: { userId?: string, style?: CSSProperties }) {
	return <img className={ "avatar" }
				style={ props.style }
				src={ "" }
				alt={ "Avatar" }
				onError={ ({ currentTarget }) => {
					currentTarget.onerror = null; // prevents looping
					currentTarget.src = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
				} }/>
}
