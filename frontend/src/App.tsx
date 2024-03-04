import React, { Suspense } from 'react';
import './App.scss';
import { BrowserRouter, Navigate, NavigateFunction, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import i18n, { TFunction } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import Dropdown from "./components/Dropdown";
import Profile from "./pages/Profile";
import BarChart from "./components/BarChart";
import Question from "./pages/Question";
import Trending from "./pages/Trending";
import Editor from "./pages/Editor";
import { useMediaQuery } from "@react-hook/media-query";
import { SkeletonTheme } from "react-loading-skeleton";

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

export default function App() {
    const { t } = useTranslation();

    return <BrowserRouter>
        <AppRouter t={ t }/>
    </BrowserRouter>;
}

function AppRouter({ t }: { t: TFunction<"translation", undefined> }) {
    const navigate = useNavigate();

    const prefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');
    const prefersLightTheme = useMediaQuery('(prefers-color-scheme: light)');

    let themePreference: "dark" | "light" | undefined = undefined;
    if (prefersDarkTheme) themePreference = "dark";
    else if (prefersLightTheme) themePreference = "light";

    return <AppComp t={ t } navigate={ navigate } themePreference={ themePreference }/>;
}

interface Props {
    t: TFunction<"translation", undefined>;
    navigate: NavigateFunction;
    themePreference?: "dark" | "light";
}

class AppComp extends React.Component<Props, { theme: "dark" | "light" }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            theme: (localStorage.getItem("theme") as "dark" | "light" || props.themePreference) ?? "light"
        };
    }

    componentDidMount() {
        this.updateThemeVariables();

        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', ({ matches }) => this.updateThemePreference(matches));

        document.addEventListener("keydown", this.onKeyDown());
    }

    componentWillUnmount() {
        window.matchMedia('(prefers-color-scheme: dark)')
            .removeEventListener('change', ({ matches }) => this.updateThemePreference(matches));

        document.removeEventListener("keydown", this.onKeyDown());
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{ theme: "dark" | "light" }>, snapshot?: any) {
        if (prevState.theme !== this.state.theme) {
            this.updateThemeVariables();
        }
    }

    updateThemeVariables() {
        let root = document.documentElement.style;

        let variables = [
            "--background-color-primary",
            "--background-color-secondary",
            "--font-color",
            "--background-color-glass",
            "--background-color-glass-simp",
            "--border-color",
            "--box-shadow",
            "--box-shadow-elevated",
            "--bleed-shadow",
            "--background-bleed-opacity"
        ];

        variables.forEach(variable => {
            let value = this.state.theme === "dark"
                ? getComputedStyle(document.documentElement).getPropertyValue(`${ variable }-dark`)
                : getComputedStyle(document.documentElement).getPropertyValue(`${ variable }-light`);
            root.setProperty(variable, value);
        });
    }

    render() {
        return <SkeletonTheme baseColor={ this.state.theme === "light" ? "#dadada" : "#333" }
                              highlightColor={ this.state.theme === "light" ? "#f5f5f5" : "#101010" }>
            <nav>
                <div style={ { position: "relative" } }>
                    <p>simpleQ</p>
                    <i className={ "fas fa-x toggle-nav" }
                       style={ {
                           fontSize: "1.5em",
                           cursor: "pointer",
                           position: "absolute",
                           right: "var(--spacing)",
                           outlineColor: "var(--primary-color-contrast)",
                           borderRadius: "var(--border-radius)",
                           outlineOffset: "calc(var(--spacing) / 2)"
                       } }
                       tabIndex={ 0 }
                       onClick={ (e) => {
                           let elem = document.querySelector("#toggle-nav-close-ref");
                           if (elem) (elem as HTMLElement).focus();
                       } }
                       onKeyDown={ (e) => {
                           if (e.key === "Enter") {
                               let elem = document.querySelector("#toggle-nav-close-ref");
                               if (elem) (elem as HTMLElement).focus();
                           }
                       } }
                    />
                </div>

                <NavLink to="/trending"><i className={ "fas fa-chart-line" }/>Trending Questions</NavLink>
                <NavLink to="/question/new"><i className={ "far fa-edit" }/>Ask Something</NavLink>
                <NavLink to="/a"><i className={ "fas fa-fire" }/>My Activity</NavLink>
                <NavLink to="/b"><i className={ "fas fa-star" }/>My Favorites</NavLink>
                <NavLink to="/c"><i className={ "fas fa-gift" }/>Daily Quests</NavLink>
                <NavLink to="/d"><i className={ "fas fa-bell" }/>Inbox<span className={ "badge" }>3</span></NavLink>

                { window.location.pathname.startsWith("/question") && <>
                    <div style={ { paddingInline: "var(--spacing)" } }>
                        <hr/>
                    </div>

                    <NavLink to="/question/1"><i className={ "far fa-question" }/><p
                        style={ { display: "flex", flexDirection: "column" } }>
                        <span className={ "caption" }>Browsing Question</span>
                        <span>How to execute..</span>
                    </p></NavLink>
                </> }

                <div style={ { flex: 1 } }/>
                <div style={ { paddingInline: "var(--spacing)" } }>
                    <hr/>
                    <p className={ "caption" } style={ { textAlign: "center" } }>My Stats</p>
                    <div className={ "stats" }>
                        <div className={ "stats-column" }>
                            <i className={ "fas fa-fire primary-icon" }/>
                            <span>253d</span>
                        </div>
                        <div className={ "stats-column" }>
                            <i className={ "fas fa-eye primary-icon" }/>
                            <span>1.8k</span>
                        </div>
                        <div className={ "stats-column" }>
                            <i className={ "fas fa-thumbs-up primary-icon" }/>
                            <span>1.1k</span>
                        </div>
                    </div>

                    <hr/>
                    <p className={ "caption" } style={ { textAlign: "center" } }>Recent Activity</p>
                    <BarChart data={
                        Array.from({ length: 30 }, () => Math.floor(Math.random() * 100))
                    }/>
                </div>
            </nav>

            <main>
                <div className={ "container transparent top-bar" }>
                    <i className={ "fas fa-bars glass toggle-nav" }
                       id={ "toggle-nav-close-ref" }
                       style={ { fontSize: "1.5em", cursor: "pointer" } }
                       tabIndex={ 0 }
                       onClick={ () => {
                           let elem = document.querySelector("nav a.active");
                           if (elem) (elem as HTMLElement).focus();
                           else elem = document.querySelector("nav a");
                           if (elem) (elem as HTMLElement).focus();
                       } }
                       onKeyDown={ (e) => {
                           if (e.key === "Enter") {
                               let elem = document.querySelector("nav a.active");
                               if (elem) (elem as HTMLElement).focus();
                               else elem = document.querySelector("nav a");
                               if (elem) (elem as HTMLElement).focus();
                           }
                       } }
                    />

                    <p className={ "glass" }
                       onKeyDown={ (e) => {
                           if (e.key === "Enter") {
                               this.toggleSearch();
                           }
                       } }
                       id={ "search-bar" }
                       tabIndex={ 0 }
                       onClick={ () => this.toggleSearch() }>
                        <i className={ "fas fa-magnifying-glass" }/>
                        <span style={ {
                            display: "flex",
                            alignItems: "center"
                        } }>Search.. { this.getSearchShortcut() }</span>
                    </p>

                    <Dropdown button={ <div className={ "glass" }
                                            style={ {
                                                borderRadius: "var(--border-radius)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingInline: "var(--spacing)",
                                                gap: "var(--spacing)",
                                                userSelect: "none",
                                                cursor: "pointer"
                                            } }
                                            tabIndex={ 0 }>
                        <img className={ "avatar" }
                             src={ "https://benniloidl.de/static/media/me.6c5597f7d72f68a1e83c.jpeg" }
                             alt={ "Benni Loidl" }/>

                        <p style={ { display: "flex", flexDirection: "column", alignItems: "flex-start" } }>
                            Benni
                            <span className={ "badge badge-sm" }>PRO</span>
                        </p>
                    </div> }
                              items={ [
                                  {
                                      icon: "fas fa-user",
                                      label: "My Profile",
                                      onClick: () => this.props.navigate("/profile")
                                  },
                                  {
                                      icon: "fas fa-language",
                                      label: "Language",
                                      shortcut: i18n.language,
                                      items: [
                                          {
                                              icon: "fas fa-globe",
                                              label: "English",
                                              onClick: () => i18n.changeLanguage("en"),
                                              shortcut: i18n.language === "en" ? <i className={ "fas fa-check" }/> : ""
                                          },
                                          {
                                              icon: "fas fa-globe",
                                              label: "German",
                                              onClick: () => i18n.changeLanguage("de"),
                                              shortcut: i18n.language === "de" ? <i className={ "fas fa-check" }/> : ""
                                          }
                                      ]
                                  },
                                  {
                                      icon: "fas fa-brush",
                                      label: "Theme",
                                      shortcut: this.capitalizeFirstLetter(localStorage.getItem("theme") || "system"),
                                      items: [
                                          {
                                              icon: "fas fa-adjust",
                                              label: "System",
                                              onClick: () => {
                                                  localStorage.removeItem("theme");
                                                  this.setState({ theme: this.props.themePreference ?? "light" });
                                              },
                                              shortcut: !localStorage.getItem("theme") ?
                                                  <i className={ "fas fa-check" }/> : ""
                                          },
                                          {
                                              icon: "fas fa-moon",
                                              label: "Dark",
                                              onClick: () => {
                                                  localStorage.setItem("theme", "dark");
                                                  this.setState({ theme: "dark" });
                                              },
                                              shortcut: localStorage.getItem("theme") === "dark" ?
                                                  <i className={ "fas fa-check" }/> : ""
                                          },
                                          {
                                              icon: "fas fa-sun",
                                              label: "Light",
                                              onClick: () => {
                                                  localStorage.setItem("theme", "light");
                                                  this.setState({ theme: "light" });
                                              },
                                              shortcut: localStorage.getItem("theme") === "light" ?
                                                  <i className={ "fas fa-check" }/> : ""
                                          }
                                      ]
                                  },
                                  {
                                      icon: "fas fa-cog",
                                      label: "Settings"
                                  },
                                  {
                                      icon: "fas fa-sign-out-alt",
                                      label: "Logout"
                                  }
                              ] }/>
                </div>

                <hr style={ { width: "100%", maxWidth: "var(--max-width)", marginBlock: "0" } }/>

                <Routes>
                    <Route path={ "/" } element={ <Suspense><Navigate to={ "/trending" }/></Suspense> }/>
                    <Route path={ "/trending" }
                           element={ <Suspense><Trending navigate={ this.props.navigate }/></Suspense> }/>
                    <Route path={ "/question/:id" } element={ <Suspense><Question/></Suspense> }/>
                    <Route path={ "/profile" } element={ <Suspense><Profile/></Suspense> }/>
                    <Route path={ "/question/new" } element={ <Suspense><Editor/></Suspense> }/>
                    <Route path={ "*" } element={ <Navigate to={ "/" }/> }/>
                </Routes>
            </main>

            <div className={ "search glass" }
                 onClick={ () => this.toggleSearch() }>
                <div className={ "search-container" }>
                    <div onClick={ (e: any) => e.stopPropagation() }>
                        <i className={ "fas fa-magnifying-glass" }/>
                        <input type={ "text" } placeholder={ "Search.." }/>
                    </div>

                    <p className={ "search-info" }>
                        Navigate using <span>↑</span> and <span>↓</span> or <span>{ "\u21B9" }</span>. Select
                        using <span>↵</span>.
                    </p>

                    <p className={ "search-result" } tabIndex={ 0 }>
                        <i className={ "far fa-question badge" }/>
                        <span>How to use React?</span>
                        <div>
                            <i className={ "far fa-user" } style={ { marginRight: "calc(var(--spacing) / 2)" } }/>
                            <span>Benni Loidl</span>
                        </div>
                        <span>Yesterday</span>
                    </p>
                </div>
            </div>
        </SkeletonTheme>;
    }

    private updateThemePreference(matches: boolean) {
        if (localStorage.getItem("theme") === null)
            this.setState({ theme: matches ? "dark" : "light" });
    }

    private capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    private onKeyDown() {
        return (e: any) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                this.toggleSearch();
                e.preventDefault();
            }

            if (e.key === "Escape") {
                const search = document.querySelector(".search");
                if (search && search.classList.contains("active")) {
                    this.toggleSearch();
                }
            }
        };
    }

    private toggleSearch() {
        const search = document.querySelector(".search");
        if (search) {
            let isActive = search.classList.contains("active");
            search.classList.toggle("active");

            let keyframes = [
                { transform: "scale(125%)" },
                { transform: "scale(100%)" }
            ]

            let duration = 200;
            let easing = "ease-in-out";

            if (isActive) {
                search.querySelector("div.search-container")!.animate(keyframes.reverse(), {
                    duration,
                    easing,
                    fill: "both"
                }).onfinish = () => {
                    // @ts-ignore
                    search.style.display = "none"
                };

                const searchBar = document.getElementById("search-bar");
                if (searchBar) searchBar.focus();
            } else {
                // @ts-ignore
                search.style.display = "flex";

                search.querySelector("div.search-container")!.animate(keyframes, {
                    duration,
                    easing,
                    fill: "both"
                });

                const input = search.querySelector("input");
                if (input) input.focus();
            }
        }
    }

    private getSearchShortcut() {
        let isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        let isLinux = navigator.platform.toUpperCase().indexOf('LINUX') >= 0;

        return <span className={ "caption" } style={ {
            marginLeft: "var(--spacing)",
            background: "var(--font-color)",
            color: "var(--background-color-primary)",
            borderRadius: "var(--border-radius)",
            paddingInline: "calc(var(--spacing) / 2)"
        } }>
            { isMac ? "⌘K" : isLinux ? "Alt + K" : "Ctrl + K" }
        </span>;
    }
}
