import React, { Suspense } from 'react';
import './App.scss';
import { Navigate, NavigateFunction, Route, Routes, useNavigate } from "react-router-dom";
import i18n, { TFunction } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { useMediaQuery } from "@react-hook/media-query";
import { SkeletonTheme } from "react-loading-skeleton";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Trending from "./pages/Trending";
import Question from "./pages/Question";
import Profile from "./pages/Profile";
import Editor from "./pages/Editor";
import Login from "./Login";
import Activity from "./pages/Activity";

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
	}
	
	componentWillUnmount() {
		window.matchMedia('(prefers-color-scheme: dark)')
			  .removeEventListener('change', ({ matches }) => this.updateThemePreference(matches));
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
		
		// update meta theme
		let meta = document.querySelector("meta[name=theme-color]") as HTMLMetaElement;
		if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--background-color-primary");
	}
	
	updateTheme(theme: "system" | "dark" | "light") {
		if (theme === "system") {
			localStorage.removeItem("theme");
			this.setState({ theme: this.props.themePreference ?? "light" });
		} else {
			localStorage.setItem("theme", theme);
			this.setState({ theme });
		}
	}
	
	render() {
		return <SkeletonTheme baseColor={ this.state.theme === "light" ? "#dadada" : "#333" }
							  highlightColor={ this.state.theme === "light" ? "#f5f5f5" : "#101010" }>
			<Routes>
				{ /* Todo: All Suspense Fallback */ }
				
				<Route index element={ <Home navigate={ this.props.navigate }/> }/>
				<Route path={ "login" } element={ <Login/> }/>
				<Route path={ "dashboard" }
					   element={ <Suspense fallback={ <p>Loading Dashboard..</p> }>
						   <Dashboard updateTheme={ this.updateTheme.bind(this) }/>
					   </Suspense> }>
					<Route index element={ <Suspense><Navigate to={ "trending" }/></Suspense> }/>
					<Route path={ "trending" }
						   element={ <Suspense><Trending navigate={ this.props.navigate }/></Suspense> }/>
					<Route path={ "question/:id" } element={ <Suspense><Question/></Suspense> }/>
					<Route path={ "profile" } element={ <Suspense><Profile/></Suspense> }/>
					<Route path={ "question/new" } element={ <Suspense><Editor/></Suspense> }/>
					<Route path={ "activity" } element={ <Suspense><Activity/></Suspense> }/>
					
					<Route path={ "*" } element={ <Navigate to={ "" }/> }/>
				</Route>
				
				<Route path={ "*" } element={ <Navigate to={ "" }/> }/>
			</Routes>
		</SkeletonTheme>;
	}
	
	private updateThemePreference(matches: boolean) {
		if (localStorage.getItem("theme") === null)
			this.setState({ theme: matches ? "dark" : "light" });
	}
}
