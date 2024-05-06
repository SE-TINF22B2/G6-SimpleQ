import { Component } from "react";
import "./Login.scss";
import MacbookMockup from "./images/macbook-mockup.png";

export default class Login extends Component<{}, {}> {
	render() {
		return <div className={ "login" }>
			<div>
				<img src={ MacbookMockup }/>
			</div>
			
			<main>
				<div>
					<h1 className={ "login-title" }>Log in with your<br/>email address</h1>
					<p className={ "login-subtitle" }>Enter the email address you used to create your account. If you do
						not
						have an account yet, one will
						be created for you.</p>
				</div>
				
				<form>
					<input type={ "email" } placeholder={ "john.doe@mail.com" } className={ "form-input" } required/>
					
					<button type={ "submit" } className={ "btn btn-primary" }><span>Continue</span></button>
				</form>
				
				<div className={ "form-divider" }>
					<div className={ "form-divider-line" }/>
					<span className={ "caption " }>Social Logins</span>
					<div className={ "form-divider-line" }/>
				</div>
				
				<div className={ "login-social" }>
					<button className={ "btn btn-secondary" }>
						<i className={ "fa-brands fa-apple" }/>
						<span>Apple</span>
					</button>
					<button className={ "btn btn-secondary" }>
						<i className={ "fa-brands fa-google" }/>
						<span>Google</span>
					</button>
				</div>
			</main>
		</div>
	}
}
