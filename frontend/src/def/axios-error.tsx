import React from "react";
import { AlertContainer } from "react-alert";

/**
 * Renders a generic error alert
 * with the axios error message in the first line (bold)
 * and custom messages from the backend (data.message) in the following lines
 * @param err The error object provided in the catch block of an axios request
 * @param alert The AlertContainer used to show the alert
 */
export const axiosError = (err: any, alert: AlertContainer) => alert.error(<>
	<span style={ { fontWeight: "bold" } }>{ err.message }</span>
	{ err.response.data.message.map((m: string) => {
		return <>
			<br/>
			{ m }
		</>
	}) }
</>)
