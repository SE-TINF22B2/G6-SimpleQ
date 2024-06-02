import React from "react";
import { AlertContainer } from "react-alert";

export const axiosError = (err: any, alert: AlertContainer) => alert.error(<>
	<span style={ { fontWeight: "bold" } }>{ err.message }</span>
	{ err.response.data.message.map((m: string) => {
		return <>
			<br/>
			{ m }
		</>
	}) }
</>)
