import React, { useEffect, useMemo } from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { InView } from "react-intersection-observer";

import mockup from "../../images/macbook-mockup.png";

// Todo: Make logo static!!!
import logoTodoMakeStatic from "../../images/logo-TODO-MAKE-STATIC.png";
import Button from "../../components/button/Button";

import benni from "../../images/benni.png";
import joshua from "../../images/joshua.png";
import leonard from "../../images/leonard.png";
import manuel from "../../images/manuel.png";
import tom from "../../images/tom.png";

export default function Home(props: { updateTheme: (theme: "system" | "dark" | "light") => void }) {
	let blobs: (HTMLDivElement | null)[] = useMemo(() => [], []);
	
	const navigate = useNavigate();
	const [currentThemeOnlyDisplay, setCurrentThemeOnlyDisplay] =
		React.useState<"dark" | "light" | "system">((localStorage.getItem("theme") as "dark" | "light" || "system"));
	
	const inViewOnChange = (inView: any, entry: any) => {
		entry.target.querySelectorAll(".fade-in").forEach((el: any, i: any) => {
			setTimeout(() => {
				if (inView) el.classList.add("fade-in-visible");
				else el.classList.remove("fade-in-visible");
			}, (i + 1) * 100);
		});
	}
	
	useEffect(() => {
		const animateBlobs = () => {
			blobs.forEach((el, i) => {
				if (!el) return;
				
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
		
		animateBlobs();
		let interval = setInterval(() => {
			animateBlobs();
		}, 2000);
		
		return () => clearInterval(interval);
	}, [blobs]);
	
	return <div className={ "home" }>
		<nav>
			<div className={ "nav-wrapper" }>
				<img src={ logoTodoMakeStatic } alt={ "Logo" }/>
				
				<div className={ "pages" }>
					<a href={ "#features" }>Features</a>
					<a href={ "#developers" }>Developers</a>
					<a href={ "#development" }>Development</a>
					<a href={ "#plans" }>Plans</a>
				</div>
				
				<Button icon={ "fi fi-rr-sign-in-alt" } onClick={ () => window.location.href = "/login" }>Login</Button>
				<Button icon={ "fi fi-rr-angle-right" } onClick={ () => navigate("dashboard") }>Dashboard</Button>
				
				<Button
					icon={ "fi fi-rr-" + (currentThemeOnlyDisplay === "system" ? "insight-alt" : currentThemeOnlyDisplay === "dark" ? "moon" : "sun") }
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
				<div className={ "home-bg-blob" } ref={ b => blobs.push(b) } style={ {
					top: "calc(var(--header-height) + 10%)",
					left: "10%",
					borderRadius: "47% 53% 67% 33% / 13% 62% 38% 87%",
					opacity: 0.6,
					background: "linear-gradient(to right, var(--primary-color), transparent), url(https://grainy-gradients.vercel.app/noise.svg)"
				} }/>
				<div className={ "home-bg-blob" } ref={ b => blobs.push(b) } style={ {
					top: "calc(var(--header-height) + 20%)",
					left: "30%",
					borderRadius: "63% 37% 23% 77% / 53% 62% 38% 47%",
					background: "linear-gradient(to left, var(--background-color-glass-simp), transparent), url(https://grainy-gradients.vercel.app/noise.svg)"
				} }/>
				
				<img src={ mockup } alt={ "Dashboard" }/>
				
				<div>
					<h1 className={ "title" }>
						Try Our Q&A Platform<br/>
						powered by <span className={ "highlight" }>AI</span>
					</h1>
					<div style={ { display: "flex", gap: "var(--spacing)", alignItems: "center" } }>
						<h2>You don't believe us?</h2>
						<Button buttonStyle={ "primary" }>Try Yourself!</Button>
						<Button icon={ "fi fi-brands-github" }
								onClick={ () => window.open("https://github.com/SE-TINF22B2/G6-SimpleQ", "_blank") }>
							Learn More on GitHub
						</Button>
					</div>
				</div>
			</section>
			
			<section className={ "page" } id={ "features" }>
				<InView as={ "div" } onChange={ inViewOnChange }>
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
							<i className={ "fi fi-rr-wallet" }/>
							<h1>100% Free.</h1>
							<p>Forever.</p>
						</div>
						<div className={ "card fade-in" }>
							<i className={ "fi fi-rr-brain" }/>
							<h1>Meet Simp.</h1>
							<p>Our Seamless AI Integration.</p>
						</div>
						<div className={ "card fade-in" }>
							<i className={ "fi fi-rr-handshake-angle" }/>
							<h1>Contribute.</h1>
							<p>Help the Community.</p>
						</div>
						<div className={ "card fade-in" }>
							<i className={ "fi fi-rr-treasure-chest" }/>
							<h1>Collect Rewards.</h1>
							<p>Stay Active.</p>
						</div>
					</div>
				</InView>
			</section>
			
			<section className={ "page" } id={ "developers" }>
				<InView as={ "div" } onChange={ inViewOnChange }>
					<h2 className={ "page-title fade-in" }>Developers</h2>
					<h1 className={ "page-subtitle fade-in" }>Meet our Team</h1>
					<p className={ "page-summary fade-in" }>
						This is the team behind simpleq. We are a group of students from the DHBW Karlsruhe in Germany
						and are excited to develop this platform.
					</p>
					
					<div className={ "members" }>
						<div className={ "member fade-in" }>
							<img src={ benni } alt={ "Benni" }/>
							<div className={ "member-details" }>
								<h1>Benni</h1>
								<div className={ "member-socials" }>
									<a href={ "https://github.com/benniloidl" } target={ "_blank" }
									   rel={ "noreferrer" }>
										<i className={ "fi fi-brands-github" }/>
									</a>
									<a href={ "https://joshua.slaar.de" } target={ "_blank" } rel={ "noreferrer" }>
										<i className={ "fi fi-brands-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ joshua } alt={ "Joshua" }/>
							<div className={ "member-details" }>
								<h1>Joshua</h1>
								<div className={ "member-socials" }>
									<a href={ "https://github.com/jozys" } target={ "_blank" }
									   rel={ "noreferrer" }>
										<i className={ "fi fi-brands-github" }/>
									</a>
									<a href={ "https://joshua.slaar.de" } target={ "_blank" } rel={ "noreferrer" }>
										<i className={ "fi fi-brands-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ leonard } alt={ "Leonard" }/>
							<div className={ "member-details" }>
								<h1>Leonard</h1>
								<div className={ "member-socials" }>
									<a href={ "https://github.com/michalskyl" } target={ "_blank" }
									   rel={ "noreferrer" }>
										<i className={ "fi fi-brands-github" }/>
									</a>
									<a href={ "https://joshua.slaar.de" } target={ "_blank" } rel={ "noreferrer" }>
										<i className={ "fi fi-brands-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ manuel } alt={ "Manuel" }/>
							<div className={ "member-details" }>
								<h1>Manuel</h1>
								<div className={ "member-socials" }>
									<a href={ "https://github.com/manuelbrs" } target={ "_blank" } rel={ "noreferrer" }>
										<i className={ "fi fi-brands-github" }/>
									</a>
									<a href={ "https://joshua.slaar.de" } target={ "_blank" } rel={ "noreferrer" }>
										<i className={ "fi fi-brands-discord" }/>
									</a>
								</div>
							</div>
						</div>
						
						<div className={ "member fade-in" }>
							<img src={ tom } alt={ "Tom" }/>
							<div className={ "member-details" }>
								<h1>Tom</h1>
								<div className={ "member-socials" }>
									<a href={ "https://github.com/integraluminium" } target={ "_blank" }
									   rel={ "noreferrer" }>
										<i className={ "fi fi-brands-github" }/>
									</a>
									<a href={ "https://joshua.slaar.de" } target={ "_blank" } rel={ "noreferrer" }>
										<i className={ "fi fi-brands-discord" }/>
									</a>
								</div>
							</div>
						</div>
					</div>
				</InView>
			</section>
			
			<section className={ "page" } id={ "development" }>
				<InView as={ "div" } onChange={ inViewOnChange }>
					<h2 className={ "page-title fade-in" }>Development</h2>
					<h1 className={ "page-subtitle fade-in" }>Follow and take part in the process</h1>
					<p className={ "page-summary fade-in" }>
						We are currently under development and are looking for contributors to help us improve our
						platform. Furthermore, we enable users to test our platform and provide feedback.
					</p>
					
					<div className={ "dev-tl" }>
						<div className={ "dev-tl-step done fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fi fi-rr-list" } style={ { top: "40%", left: "30%" } }/>
								<i className={ "fi fi-rr-split" }
								   style={ { top: "65%", left: "65%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Requirements</p>
							<p className={ "caption" }>~ 10 weeks</p>
						</div>
						
						<div className={ "dev-tl-step done fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fi fi-rr-brush" } style={ { top: "35%", left: "70%" } }/>
								<i className={ "fi fi-rr-pen-nib" } style={ { top: "55%", left: "30%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Planning</p>
							<p className={ "caption" }>~ 12 weeks</p>
						</div>
						
						<div className={ "dev-tl-step progress fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fi fi-rr-gears" } style={ { top: "30%", left: "70%" } }/>
								<i className={ "fi fi-rr-display-code" } style={ { top: "70%", left: "50%" } }/>
								<i className={ "fi fi-rr-keyboard" } style={ { top: "40%", left: "25%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Implementing</p>
							<p className={ "caption" }>~ 4 weeks</p>
						</div>
						
						<div className={ "dev-tl-step incoming fade-in" }>
							<div className={ "dev-tl-icons" }>
								<i className={ "fi fi-rr-quiz" } style={ { top: "40%", left: "35%" } }/>
								<i className={ "fi fi-rr-clipboard" } style={ { top: "60%", left: "65%" } }/>
							</div>
							<p className={ "dev-tl-desc" }>Testing</p>
							<p className={ "caption" }>~ 1 week</p>
						</div>
					</div>
					
					<a href={ "https://github.com/SE-TINF22B2/G6-SimpleQ" } target={ "_blank" } rel={ "noreferrer" }
					   className={ "fade-in" }
					   style={ { textDecoration: "none", color: "var(--primary-color)" } }>
						<i className={ "fi fi-rr-arrow-right" } style={ { marginRight: "var(--spacing)" } }/>
						<span>For further information, please have a look at the Wiki linked in our GitHub Repository.</span>
					</a>
				</InView>
			</section>
			
			<section className={ "page" } id={ "plans" }>
				<InView as={ "div" } onChange={ inViewOnChange }>
					<h2 className={ "page-title fade-in" }>Meet our Plans</h2>
					<h1 className={ "page-subtitle fade-in" }>Take the next step</h1>
					<p className={ "page-summary fade-in" }>Take a look at our convenient plans that intend to improve
						your question-related workflows even more.</p>
					
					<div className={ "plans" }>
						<div className={ "plan fade-in" }>
							<div style={ {
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								gap: "var(--spacing)",
								background: "var(--background-color-secondary)",
								margin: "calc(var(--spacing) * -1)",
								padding: "var(--spacing)"
							} }>
								<h1>Guest</h1>
								<span className={ "badge badge-outline" }>Most Secure</span>
							</div>
							<hr style={ { opacity: 0 } }/>
							<p>
								<i className={ "fi fi-rr-comment primary-icon" }/>
								<span>
									<span className={ "caption" }>Basic Features</span>
									<br/>
									<span>Ask Questions</span>
								</span>
							</p>
							
							<div style={ { flex: 1, marginBlock: "var(--spacing)" } }/>
							<h2>
								Free.
								<br/>
								Forever.
							</h2>
						</div>
						
						<div className={ "divider fade-in" }/>
						
						<div className={ "plan fade-in" }>
							<div style={ {
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								gap: "var(--spacing)",
								background: "var(--background-color-secondary)",
								margin: "calc(var(--spacing) * -1)",
								padding: "var(--spacing)"
							} }>
								<h1>User</h1>
							</div>
							<hr style={ { opacity: 0 } }/>
							<p>
								<i className={ "fi fi-rr-comment primary-icon" }/>
								<span>
									<span className={ "caption" }>Basic Features</span>
									<br/>
									<span>Ask Questions</span>
									<br/>
									<span>Create Answers</span>
								</span>
							</p>
							<hr/>
							<p>
								<i className={ "fi fi-rr-brain primary-icon" }/>
								<span>
									<span className={ "caption" }>AI Answers</span>
									<br/>
									<span>up to 3 / day</span>
								</span>
							</p>
							
							<div style={ { flex: 1, marginBlock: "var(--spacing)" } }/>
							<h2>
								Free.
								<br/>
								Forever.
							</h2>
						</div>
						
						<div className={ "divider fade-in" }/>
						
						<div className={ "plan fade-in" }>
							<div style={ {
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								gap: "var(--spacing)",
								background: "var(--background-color-secondary)",
								margin: "calc(var(--spacing) * -1)",
								padding: "var(--spacing)"
							} }>
								<h1>Pro</h1>
								<span className={ "badge" }>Recommended</span>
							</div>
							<hr style={ { opacity: 0 } }/>
							<p>
								<i className={ "fi fi-rr-comment primary-icon" }/>
								<span>
									<span className={ "caption" }>Basic Features</span>
									<br/>
									<span>Ask Questions</span>
									<br/>
									<span>Create Answers</span>
								</span>
							</p>
							<hr/>
							<p>
								<i className={ "fi fi-rr-brain primary-icon" }/>
								<span>
									<span className={ "caption" }>AI Answers</span>
									<br/>
									<span>unlimited</span>
								</span>
							</p>
							
							<div style={ { flex: 1, marginBlock: "var(--spacing)" } }/>
							<h2>
								2.99
								<span className={ "caption" }> / mo.</span>
							</h2>
						</div>
					</div>
				</InView>
			</section>
			
			<section className={ "page" }>
				<div>
					<h2 className={ "page-title" }>Let's go!</h2>
					<h1 className={ "page-subtitle" }>What are you waiting for?</h1>
					<p className={ "page-summary" }>Instead of reading this, you could have already submitted your first
						question to the community.</p>
				</div>
				<div style={ {
					display: "flex",
					flexDirection: "row",
					alignItems: "flex-end",
					borderTop: "var(--outline-width) solid var(--border-color)",
					paddingBlock: "var(--spacing)"
				} }>
					<div style={ { flex: 1 } }>
						<p>© simpleQ 2024</p>
						<a href={ "mailto:mail@simpleq.simplepeople.com" }>mail@simpleq.simplepeople.com</a>
					</div>
					<div style={ { flex: 1 } }>
						UIcons by <a href={ "https://www.flaticon.com/uicons" }
									 target={ "_blank" } rel={ "noreferrer" }>Flaticon</a>
					</div>
				</div>
			</section>
		</main>
	</div>
}
