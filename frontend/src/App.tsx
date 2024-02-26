import React from 'react';
import './App.css';
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

// {t('Welcome to React')}
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "Welcome to React": "Welcome to React and react-i18next"
                }
            }
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

function App() {
    const { t } = useTranslation();

    return <BrowserRouter>
        <nav>
            <div>
                <p>simpleQ</p>
            </div>
            <NavLink to="/"><i className={ "fas fa-question" }/>Trending Questions</NavLink>
            <NavLink to="/a"><i className={ "fas fa-fire" }/>My Activity</NavLink>
            <NavLink to="/b"><i className={ "fas fa-star" }/>My Favorites</NavLink>
            <NavLink to="/c"><i className={ "fas fa-toolbox" }/>Daily Quests</NavLink>
            <NavLink to="/d"><i className={ "fas fa-bell" }/>Inbox<span className={ "badge" }>3</span></NavLink>
        </nav>

        <main>
            <div className={ "container top-bar" }>
                <p className={ "search-bar" }>
                    <i className={ "fas fa-magnifying-glass" }/>
                    <span>Search..</span>
                </p>

                <div style={ {
                    backgroundColor: "var(--background-color-primary)",
                    borderRadius: "var(--border-radius)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingInline: "var(--spacing)",
                    gap: "var(--spacing)"
                } }>
                    <img className={ "avatar" }
                         src={ "https://benniloidl.de/static/media/me.6c5597f7d72f68a1e83c.jpeg" }
                         alt={ "Benni Loidl" }/>

                    <p>
                        Benni
                        <span className={ "badge badge-sm" } style={ { marginInline: "var(--spacing)" } }>PRO</span>
                    </p>
                </div>
            </div>

            <Routes>
                <Route path="/" element={ <div className={ "container" }><h1>Home</h1></div> }/>
                <Route path="/about" element={ <h1>About</h1> }/>
            </Routes>
        </main>
    </BrowserRouter>
}

export default App;
