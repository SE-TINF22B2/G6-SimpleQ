import React from "react";
import "./Profile.scss";
import completing from "../../../illustrations/completing.svg";

/**
 * Renders the profile page, currently static
 */
export default function Profile(props: {}) {
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
					<div style={ { display: "flex", gap: "var(--spacing)" } }>
						<img src={ "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" }
							 alt={ "Avatar" }
							 style={ {
								 height: "100px",
								 width: "100px",
								 borderRadius: "50%",
								 objectFit: "cover"
							 } }/>
						<button className={ "btn btn-glass" } style={ { alignSelf: "center" } }>
							<i className={ "fi fi-rr-upload" }/>
							<span>Upload</span>
						</button>
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
						<label className={ "caption" } htmlFor={ "firstname" }>First Name</label>
					</td>
					<td style={ { width: "50%", paddingLeft: "calc(var(--spacing) / 2)" } }>
						<label className={ "caption" } htmlFor={ "lastname" }>Last Name</label>
					</td>
				</tr>
				<tr>
					<td style={ { paddingRight: "calc(var(--spacing) / 2)" } }>
						<input type={ "text" } className={ "form-input" } id={ "firstname" }
							   placeholder={ "John" } defaultValue={ "Benni" } style={ { width: "100%" } }/>
					</td>
					<td style={ { paddingLeft: "calc(var(--spacing) / 2)" } }>
						<input type={ "text" } className={ "form-input" } id={ "lastname" }
							   placeholder={ "Doe" } defaultValue={ "Loidl" } style={ { width: "100%" } }/>
					</td>
				</tr>
				<tr>
					<td style={ { paddingRight: "calc(var(--spacing) / 2)" } }>
						<label className={ "caption" } htmlFor={ "email" }>Email</label>
					</td>
				</tr>
				<tr>
					<td style={ { paddingRight: "calc(var(--spacing) / 2)" } }>
						<input type={ "email" } className={ "form-input" } id={ "email" }
							   placeholder={ "john.doe@gmail.com" } style={ { width: "100%" } }/>
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
		
		<div className={ "container profile-memberships" }>
			<h2>
				<i className={ "fi fi-rr-ranking-star" }/>
				My Membership
			</h2>
			<p>Upgrade your membership to unlock more features.</p>
			
			<hr/>
			
			<table style={ { width: "100%", textAlign: "center" } }>
				<tbody>
				<tr>
					<td style={ { width: "25%" } }></td>
					<td style={ { width: "25%" } }></td>
					<td style={ { width: "25%" } }></td>
					<td className={ "caption" } style={ { width: "25%", } }>My Current Plan
					</td>
				</tr>
				<tr>
					<td></td>
					<td className={ "plan" } style={ { background: "var(--background-color-secondary)" } }>Free</td>
					<td className={ "plan" }
						style={ { background: "var(--primary-color)", color: "var(--primary-color-contrast)" } }>
						Premium
					</td>
					<td className={ "plan" }
						style={ { background: "var(--primary-color)", color: "var(--primary-color-contrast)" } }>
						Pro
					</td>
				</tr>
				<tr>
					<td style={ { textAlign: "left" } }>
						<i className={ "fi fi-rr-question" }/>
						Ask Questions
					</td>
					<td><i className={ "fi fi-rr-check" }/></td>
					<td><i className={ "fi fi-rr-check" }/></td>
					<td><i className={ "fi fi-rr-check" }/></td>
				</tr>
				<tr>
					<td style={ { textAlign: "left" } }>
						<i className={ "fi fi-rr-comment-dots" }/>
						Comment
					</td>
					<td><i className={ "fi fi-rr-check" }/></td>
					<td><i className={ "fi fi-rr-check" }/></td>
					<td><i className={ "fi fi-rr-check" }/></td>
				</tr>
				<tr>
					<td style={ { textAlign: "left" } }>
						<i className={ "fi fi-rr-brain" }/>
						AI Replies
					</td>
					<td>up to 3 / m</td>
					<td><i className={ "fi fi-rr-infinity" }/></td>
					<td><i className={ "fi fi-rr-infinity" }/></td>
				</tr>
				<tr>
					<td style={ { textAlign: "left" } }>
						<i className={ "fi fi-rr-wallet" }/>
						Price
					</td>
					<td><p>
						<span style={ { fontSize: "2em" } }>€0.00</span>
						<span> / m</span>
					</p></td>
					<td><p>
						<span style={ { fontSize: "2em" } }>€1.99</span>
						<span> / m</span>
					</p></td>
					<td><p>
						<span style={ { fontSize: "2em" } }>€4.99</span>
						<span> / m</span>
					</p></td>
				</tr>
				</tbody>
			</table>
		</div>
	</>
}
