import React, { Component } from "react"
import "./Timeline.scss"

/**
 * Renders a timeline, currently used as a static class inside Activity
 */
export default class Timeline extends Component<any, any> {
	static updateTimeline = () => {
		// @ts-ignore
		let height = window.scrollY + window.innerHeight * 0.8 - document.querySelector(".timeline")?.offsetTop
		
		if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
			height = document.body.offsetHeight
		}
		
		// @ts-ignore
		document.querySelector(".timeline")?.style.setProperty("--timeline-height", `${ height }px`)
		
		document.querySelectorAll(".timeline-item").forEach((item: any) => {
			if (item.offsetTop < height) {
				item.classList.add("timeline-item-active")
			} else {
				item.classList.remove("timeline-item-active")
			}
		})
	}
	
	componentDidMount() {
		Timeline.updateTimeline()
		
		window.addEventListener("scroll", this.onScrollOrResize)
		window.addEventListener("resize", this.onScrollOrResize)
	}
	
	componentWillUnmount() {
		window.removeEventListener("scroll", this.onScrollOrResize)
		window.removeEventListener("resize", this.onScrollOrResize)
	}
	
	onScrollOrResize = () => {
		Timeline.updateTimeline()
	}
	
	render() {
		return <div className={ "timeline" }>
			{
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((item) => (
					<>
						<div className={ "timeline-item" }>
							<div className={ "timeline-point" }><i className={ "far fa-question fa-xl" }/></div>
							<section className={ "timeline-content" }>
								<h1>
									How to rescue waterlogged iPhone?
								</h1>
								
								<p>
									<span className={ "badge" }>iPhone 5s</span>
									<span className={ "badge" }>Water Damage</span>
									<span className={ "badge" }>Repair</span>
									
									<span style={ {
										background: "var(--border-color)",
										width: "var(--outline-width)",
										borderRadius: "var(--border-radius)",
										alignSelf: "stretch"
									} }/>
									
									<span className={ "caption" }>Question Created · 2013-09-20</span>
								</p>
							</section>
						</div>
						<div className={ "timeline-item" }>
							<div className={ "timeline-point" }><i className={ "far fa-comment fa-xl" }/></div>
							<section className={ "timeline-content" }>
								<h1>
									Where to buy iPhone 5s parts?
								</h1>
								
								<p>
									<span className={ "badge" }>iPhone 5s</span>
									<span className={ "badge" }>Repair</span>
									<span className={ "badge" }>Electronics</span>
									
									<span style={ {
										background: "var(--border-color)",
										width: "var(--outline-width)",
										borderRadius: "var(--border-radius)",
										alignSelf: "stretch"
									} }/>
									
									<span className={ "caption" }>Question Answered · 2013-09-20</span>
								</p>
							</section>
						</div>
					</>
				))
			}
		</div>
	}
}
