import React from "react";
import "./Home.scss";
import { NavigateFunction } from "react-router-dom";
import { InView } from "react-intersection-observer";

export default function Home({ navigate }: { navigate: NavigateFunction }) {
    return <div className={ "home" }>
        <nav>
            <div className={ "nav-wrapper" }>
                <a href={ "#" } className={ "brand" }>
                    <i className={ "fas fa-brain" }/>
                    <span>AI</span>
                </a>

                <div className={ "pages" }>
                    <a href={ "#" }>Features</a>
                    <a href={ "#" }>Features</a>
                    <a href={ "#" }>Features</a>
                    <a href={ "#" }>Features</a>
                </div>

                <button className={ "btn" } onClick={ () => navigate("dashboard") }>
                    <span>Dashboard</span>
                    <i className={ "fas fa-angle-right" }/>
                </button>
            </div>
        </nav>

        <main>
            <section className={ "page" }>
                <div>
                    <h1 className={ "title" }>Our <span className={ "highlight" }>AI</span> will solve any problem!</h1>
                    <div style={ { display: "flex", gap: "var(--spacing)", alignItems: "center" } }>
                        <h2>You don't believe us?</h2>
                        <button className={ "btn btn-primary" }>
                            <span>Try Yourself!</span>
                        </button>
                    </div>
                </div>
            </section>

            <section className={ "page" }>
                <InView as={ "div" } onChange={ (inView, entry) => {
                    entry.target.querySelectorAll(".fade-in").forEach((el, i) => {
                        setTimeout(() => {
                            if (inView) el.classList.add("fade-in-visible");
                            else el.classList.remove("fade-in-visible");
                        }, (i + 1) * 200);
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
                </InView>

                <InView className={ "cards" } onChange={ (inView, entry) => {
                    entry.target.querySelectorAll(".fade-in").forEach((el, i) => {
                        setTimeout(() => {
                            if (inView) el.classList.add("fade-in-visible");
                            else el.classList.remove("fade-in-visible");
                        }, (i + 1) * 200);
                    });
                } }>
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
                </InView>
            </section>
        </main>
    </div>
}
