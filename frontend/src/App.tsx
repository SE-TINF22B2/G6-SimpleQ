import React, { Suspense, useEffect } from 'react';
import './App.scss';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import { useMediaQuery } from "@react-hook/media-query";
import { SkeletonTheme } from "react-loading-skeleton";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Trending from "./pages/Trending";
import QuestionView from "./pages/QuestionView";
import Profile from "./pages/Profile";
import Editor from "./pages/Editor";
import Login from "./Login";
import Activity from "./pages/Activity";
import Quests from "./pages/Quests";

i18n.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: translationEN
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
	
	const [theme, setTheme] = React.useState<"dark" | "light">(
		(localStorage.getItem("theme") as "dark" | "light" || themePreference) ?? "light");
	
	useEffect(() => {
		updateThemeVariables();
	}, [theme]);
	
	useEffect(() => {
		window.matchMedia('(prefers-color-scheme: dark)')
			  .addEventListener('change', ({ matches }) => updateThemePreference(matches));
		
		return () => window.matchMedia('(prefers-color-scheme: dark)')
						   .removeEventListener('change', ({ matches }) => updateThemePreference(matches));
	}, []);
	
	const updateThemeVariables = () => {
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
			let value = theme === "dark"
				? getComputedStyle(document.documentElement).getPropertyValue(`${ variable }-dark`)
				: getComputedStyle(document.documentElement).getPropertyValue(`${ variable }-light`);
			root.setProperty(variable, value);
		});
		
		// update meta theme
		let meta = document.querySelector("meta[name=theme-color]") as HTMLMetaElement;
		if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--background-color-primary");
	}
	
	const updateTheme = (theme: "system" | "dark" | "light") => {
		if (theme === "system") {
			localStorage.removeItem("theme");
			setTheme(themePreference ?? "light");
		} else {
			localStorage.setItem("theme", theme);
			setTheme(theme);
		}
	}
	
	const updateThemePreference = (matches: boolean) => {
		if (localStorage.getItem("theme") === null)
			setTheme(matches ? "dark" : "light");
	}
	
	return <SkeletonTheme baseColor={ theme === "light" ? "#dadada" : "#333" }
						  highlightColor={ theme === "light" ? "#f5f5f5" : "#101010" }>
		<Routes>
			{ /* Todo: All Suspense Fallback */ }
			
			<Route index element={ <Home updateTheme={ updateTheme }/> }/>
			<Route path={ "login" } element={ <Login/> }/>
			<Route path={ "dashboard" }
				   element={ <Suspense fallback={ <p>Loading Dashboard..</p> }>
					   <Dashboard updateTheme={ updateTheme }/>
				   </Suspense> }>
				<Route index element={ <Suspense><Navigate to={ "trending" }/></Suspense> }/>
				<Route path={ "trending" }
					   element={ <Suspense><Trending/></Suspense> }/>
				<Route path={ "question/:id" } element={ <Suspense><QuestionView/></Suspense> }/>
				<Route path={ "profile" } element={ <Suspense><Profile/></Suspense> }/>
				<Route path={ "question/new" } element={ <Suspense><Editor/></Suspense> }/>
				<Route path={ "activity" } element={ <Suspense><Activity/></Suspense> }/>
				<Route path={ "quests" } element={ <Suspense><Quests/></Suspense> }/>
				
				<Route path={ "*" } element={ <Navigate to={ "" }/> }/>
			</Route>
			
			<Route path={ "*" } element={ <Navigate to={ "" }/> }/>
		</Routes>
	</SkeletonTheme>;
}
