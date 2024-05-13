import React, { useEffect } from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { InView } from "react-intersection-observer";

import mockup from "./images/macbook-mockup.png";

// Todo: Make logo static!!!
import logoTodoMakeStatic from "./images/logo-TODO-MAKE-STATIC.png";
import Button from "./components/Button";

import benni from "./images/benni.png";
import joshua from "./images/joshua.png";
import leonard from "./images/leonard.png";
import manuel from "./images/manuel.png";
import tom from "./images/tom.png";

export default function Home(props: { updateTheme: (theme: "system" | "dark" | "light") => void }) {
	const navigate = useNavigate();
	const [currentThemeOnlyDisplay, setCurrentThemeOnlyDisplay] =
		React.useState<"dark" | "light" | "system">((localStorage.getItem("theme") as "dark" | "light" || "system"));
	
	useEffect(() => {
		animateBlobs();
		let interval = setInterval(() => {
			animateBlobs();
		}, 2000);
		
		return () => clearInterval(interval);
	}, []);
	
	const animateBlobs = () => {
		document.querySelectorAll(".home-bg-blob").forEach((el, i) => {
			let r1 = 20 + Math.floor(Math.random() * 60);
			let r2 = 20 + Math.floor(Math.random() * 60);
			let r3 = 20 + Math.floor(Math.random() * 60);
			let r4 = 20 + Math.floor(Math.random() * 60);
			
			let sx = 0.8 + Math.random() * 0.4;
			let sy = 0.8 + Math.random() * 0.4;
			
			el.animate([
				{
					borderRadius: `${ r1 }% ${ 100 - r1 }% ${ r2 }% ${ 100 - r2 }% / ${ r3 }% ${ r4 }% ${ 100 - r4 }% ${ 100 - r3 }%`,
					transform: `scale(${ sx }, ${ sy })`
				}
			], {
				duration: 2000,
				delay: i * 1000,
				iterations: 1,
				fill: "forwards",
				easing: "ease"
			});
		});
	}
	
	return <div className={ "home" }>
		<nav>
			<div className={ "nav-wrapper" }>
				<img src={ logoTodoMakeStatic }/>
				
				<div className={ "pages" }>
					<a href={ "#" }>Features</a>
					<a href={ "#" }>Developers</a>
					<a href={ "#" }>Development</a>
					<a href={ "login" }>Login</a>
				</div>
				
				<Button icon={ "fas fa-sign-in-alt" } onClick={ () => window.location.href = "/login" }>Login</Button>
				<Button icon={ "fas fa-angle-right" } onClick={ () => navigate("dashboard") }>Dashboard</Button>
				
				<Button
					icon={ "fas fa-" + (currentThemeOnlyDisplay === "system" ? "adjust" : currentThemeOnlyDisplay === "dark" ? "moon" : "sun") }
					onClick={ () => {
						let theme: "dark" | "light" | "system" = (localStorage.getItem("theme") as "dark" | "light" || "system");
						theme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
						setCurrentThemeOnlyDisplay(theme);
						props.updateTheme(theme);
					} }>
					{ currentThemeOnlyDisplay }
				</Button>
			</div>
		</nav>
		
		<main>
			<section className={ "page" }>
				<div className={ "home-bg-blob" } style={ {
					position: "absolute",
					zIndex: -1,
					height: "40%",
					width: "40%",
					top: "calc(var(--header-height) + 10%)",
					left: "10%",
					borderRadius: "47% 53% 67% 33% / 13% 62% 38% 87%",
					opacity: 0.6,
					background: "linear-gradient(to right, var(--primary-color), transparent), url(https://grainy-gradients.vercel.app/noise.svg)"
				} }/>
				<div className={ "home-bg-blob" } style={ {
					position: "absolute",
					zIndex: -1,
					height: "40%",
					width: "40%",
					top: "calc(var(--header-height) + 20%)",
					left: "30%",
					borderRadius: "63% 37% 23% 77% / 53% 62% 38% 47%",
					background: "linear-gradient(to left, var(--background-color-glass-simp), transparent), url(https://grainy-gradients.vercel.app/noise.svg)"
				} }/>
				
				<img src={ mockup }/>
				
				<div>
					<h1 className={ "title" }>
						Try Our Q&A Platform<br/>
						powered by <span className={ "highlight" }>AI</span>
					</h1>
					<div style={ { display: "flex", gap: "var(--spacing)", alignItems: "center" } }>
						<h2>You don't believe us?</h2>
						<Button style={ "primary" }>Try Yourself!</Button>
						<Button icon={ "fa-brands fa-github" }
								onClick={ () => window.open("https://github.com/SE-TINF22B2/G6-SimpleQ", "_blank") }>
							Learn More on GitHub
						</Button>
					</div>
				</div>
			</section>
			
			<section className={ "page" }>
				<InView as={ "div" } onChange={ (inView, entry) => {
					entry.target.querySelectorAll(".fade-in").forEach((el, i) => {
						
						// Todo: Timeout only for fading in, not for fading out!!
						
						setTimeout(() => {
							if (inView) el.classList.add("fade-in-visible");
							else el.classList.remove("fade-in-visible");
						}, (i + 1) * 100);
					});
				} }>
					<h2 className={ "page-title fade-in" }>Features</h2>
					<h1 className={ "page-subtitle fade-in" }>What We Offer</h1>
					<p className={ "page-summary fade-in" }>
						We offer a wide range of features to help you with your daily tasks.
					</p>
					<button className={ "btn btn-primary fade-in" }>
						<span>Try Yourself!</span>
					</button>
					
					<div className={ "cards" }>
						<div className={ "card fade-in" }>
							<i className={ "fas fa-wallet" }/>
							<h1>100% Free.</h1>
							<p>Forever.</p>
						</div>
						<div className={ "card fade-in" }>
							<i className={ "fas fa-brain" }/>
							<h1>Meet Simp.</h1>
							<p>Our Seamless AI Integration.</p>
						</div>
						<div className={ "card fade-in" }>
							<i className={ "fas fa-handshake-angle" }/>
							<h1>Contribute.</h1>
							<p>Help the Community.</p>
						</div>
						<div className={ "card fade-in" }>
							<i className={ "fas fa-toolbox" }/>
							<h1>Collect Rewards.</h1>
							<p>Stay Active.</p>
						</div>
					</div>
				</InView>
			</section>
			
			<section className={ "page" }>
				<InView as={ "div" } onChange={ (inView, entry) => {
					entry.target.querySelectorAll(".fade-in").forEach((el, i) => {
						setTimeout(() => {
							if (inView) el.classList.add("fade-in-visible");
							else el.classList.remove("fade-in-visible");
						}, (i + 1) * 100);
					});
				} }>
					<h2 className={ "page-title fade-in" }>Developers</h2>
					<h1 className={ "page-subtitle fade-in" }>Meet our Team</h1>
					<p className={ "page-summary fade-in" }>
						This is the team behind simpleq. We are a group of students from the DHBW Karlsruhe in Germany
						and are excited to develop this platform.
					</p>
					
					<div className={ "members" }>
						<div className={ "member fade-in" }>
							<img src={ benni }/>
							<div className={ "member-details" }>
								<h1>Benni</h1>
								<div className={ "member-socials" }>
									<a href={ "" }>
										<i className={ "fa-brands fa-github" }/>
									</a>
									<a href={ "" }>
										<i className={ "fa-brands fa-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ joshua }/>
							<div className={ "member-details" }>
								<h1>Joshua</h1>
								<div className={ "member-socials" }>
									<a href={ "" }>
										<i className={ "fa-brands fa-github" }/>
									</a>
									<a href={ "" }>
										<i className={ "fa-brands fa-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ leonard }/>
							<div className={ "member-details" }>
								<h1>Leonard</h1>
								<div className={ "member-socials" }>
									<a href={ "" }>
										<i className={ "fa-brands fa-github" }/>
									</a>
									<a href={ "" }>
										<i className={ "fa-brands fa-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ manuel }/>
							<div className={ "member-details" }>
								<h1>Manuel</h1>
								<div className={ "member-socials" }>
									<a href={ "" }>
										<i className={ "fa-brands fa-github" }/>
									</a>
									<a href={ "" }>
										<i className={ "fa-brands fa-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ tom }/>
							<div className={ "member-details" }>
								<h1>Tom</h1>
								<div className={ "member-socials" }>
									<a href={ "" }>
										<i className={ "fa-brands fa-github" }/>
									</a>
									<a href={ "" }>
										<i className={ "fa-brands fa-discord" }/>
									</a>
								</div>
							</div>
						</div>
					</div>
				</InView>
			</section>
			
			<section className={ "page" }>
				<InView as={ "div" } onChange={ (inView, entry) => {
					entry.target.querySelectorAll(".fade-in").forEach((el, i) => {
						setTimeout(() => {
							if (inView) el.classList.add("fade-in-visible");
							else el.classList.remove("fade-in-visible");
						}, (i + 1) * 100);
					});
				} }>
					<h2 className={ "page-title fade-in" }>Development</h2>
					<h1 className={ "page-subtitle fade-in" }>Follow and take part in the process</h1>
					<p className={ "page-summary fade-in" }>
						We are currently under development and are looking for contributors to help us improve our
						platform. Furthermore, we enable users to test our platform and provide feedback.
					</p>
					
					<div className={ "dev-tl" }>
						<div className={ "dev-tl-step done fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fas fa-list" } style={ { top: "40%", left: "30%" } }/>
								<i className={ "fas fa-arrows-split-up-and-left" }
								   style={ { top: "65%", left: "65%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Requirements</p>
							<p className={ "caption" }>~ 10 weeks</p>
						</div>
						
						<div className={ "dev-tl-step done fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fas fa-brush" } style={ { top: "35%", left: "70%" } }/>
								<i className={ "fas fa-pen" } style={ { top: "55%", left: "30%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Planning</p>
							<p className={ "caption" }>~ 12 weeks</p>
						</div>
						
						<div className={ "dev-tl-step progress fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fas fa-gear" } style={ { top: "30%", left: "70%" } }/>
								<i className={ "fas fa-code" } style={ { top: "70%", left: "50%" } }/>
								<i className={ "far fa-keyboard" } style={ { top: "40%", left: "25%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Implementing</p>
							<p className={ "caption" }>~ 4 weeks</p>
						</div>
						
						<div className={ "dev-tl-step incoming fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fas fa-flask-vial" } style={ { top: "40%", left: "35%" } }/>
								<i className={ "far fa-clipboard" } style={ { top: "60%", left: "65%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Testing</p>
							<p className={ "caption" }>~ 1 week</p>
						</div>
					</div>
					
					<a href={ "https://github.com/SE-TINF22B2/G6-SimpleQ" } target={ "_blank" }
					   className={ "fade-in" }
					   style={ { textDecoration: "none", color: "var(--primary-color)" } }>
						<i className={ "fas fa-arrow-right" } style={ { marginRight: "var(--spacing)" } }/>
						<span>For further information, please have a look at the Wiki linked in our GitHub Repository.</span>
					</a>
				</InView>
			</section>
		</main>
	</div>
}
