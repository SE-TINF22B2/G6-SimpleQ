import React, { useEffect } from "react";
import "./Profile.scss";
import completing from "../../../illustrations/completing.svg";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import Button from "../../../components/button/Button";

/**
 * Renders the profile page, currently static
 */
export default function Profile(props: {}) {
	const alert = useAlert();
	
	useEffect(() => {
		global.axios.get("profile", { withCredentials: true })
			  .then(res => console.log(res))
			  .catch(err => axiosError(err, alert));
	}, [alert]);
	
	return <>
		<div className={ "container profile-main" }>
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h1>
						<i className={ "fi fi-rr-user" }/>
						Profile
					</h1>
					<p>View and edit your profile.</p>
					
					<hr/>
					<h3>Profile Picture</h3>
					<div style={ { display: "flex", gap: "var(--spacing)", alignItems: "center" } }>
						<img src={ "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" }
							 alt={ "Avatar" }
							 style={ {
								 height: "100px",
								 width: "100px",
								 borderRadius: "50%",
								 objectFit: "cover"
							 } }/>
						<Button icon={ "fi fi-rr-upload" }>Upload</Button>
					</div>
				</div>
				
				<img src={ completing } alt={ "Completing" }
					 style={ { height: "180px", alignSelf: "center", userSelect: "none", pointerEvents: "none" } }/>
			</div>
			
			<hr/>
			<h3>Basic Information</h3>
			<table style={ { width: "100%" } }>
				<tbody>
				<tr>
					<td style={ { width: "50%", paddingRight: "calc(var(--spacing) / 2)" } }>
						<label className={ "caption" } htmlFor={ "firstname" }>Username</label>
					</td>
				</tr>
				<tr>
					<td style={ { paddingRight: "calc(var(--spacing) / 2)" } }>
						<input type={ "text" } className={ "form-input" } id={ "firstname" }
							   placeholder={ "John" } defaultValue={ "John Doe" } style={ { width: "100%" } }/>
					</td>
				</tr>
				</tbody>
			</table>
		</div>
		
		<div className={ "container profile-expert-topics" }>
			<h2>
				<i className={ "fi fi-rr-brain" }/>
				Expert Topics
			</h2>
			<p>Choose your expert topics to help others find you.</p>
			
			<hr/>
			
			<div style={ { display: "flex", gap: "var(--spacing)" } }>
				<div style={ { flex: 1 } }>
					<h3>My Expert Topics</h3>
					<p>Choose your expert topics to help others find you.</p>
				</div>
				
				<div style={ { flex: 1 } }>
					<h3>Choose Expert Topics</h3>
					<p>Choose your expert topics to help others find you.</p>
				</div>
			</div>
		</div>
	</>
}
