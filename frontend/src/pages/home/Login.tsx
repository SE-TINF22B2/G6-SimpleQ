import { Component } from "react";
import "./Login.scss";
import MacbookMockup from "../../images/macbook-mockup.png";
import Button from "../../components/button/Button";

export default class Login extends Component<{}, {}> {
	render() {
		return <div className={ "login" }>
			<div>
				<img src={ MacbookMockup } alt={ "Dashboard" }/>
			</div>
			
			<main>
				{ document.referrer !== window.location.href &&
                    <a href={ document.referrer } className={ "back" }>
                        <i className={ "fi fi-rr-arrow-left" }/>
                        <span>Go back</span>
                    </a>
				}
				
				<div>
					<h1 className={ "login-title" }>Log in with your<br/>email address</h1>
					<p className={ "login-subtitle" }>Enter the email address you used to create your account. If you do
						not
						have an account yet, one will
						be created for you.</p>
				</div>
				
				<form>
					<input type={ "email" } placeholder={ "john.doe@mail.com" } className={ "form-input" } required/>
					
					<Button buttonStyle={ "primary" } type={ "submit" }>Continue</Button>
				</form>
				
				<div className={ "form-divider" }>
					<div className={ "form-divider-line" }/>
					<span className={ "caption " }>Social Logins</span>
					<div className={ "form-divider-line" }/>
				</div>
				
				<div className={ "login-social" }>
					<Button iconLeft={ "fi fi-brands-apple" }>Apple</Button>
					<Button iconLeft={ "fi fi-brands-google" }>Google</Button>
				</div>
			</main>
		</div>
	}
}
