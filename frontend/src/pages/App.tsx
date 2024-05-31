import React, { Suspense, useEffect } from 'react';
import './App.scss';
import { Navigate, Route, Routes } from "react-router-dom";
import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "../locales/en/translation.json";
import { useMediaQuery } from "@react-hook/media-query";
import { SkeletonTheme } from "react-loading-skeleton";
import Home from "./home/Home";
import Dashboard from "./dashboard/Dashboard";
import Trending from "./dashboard/trending/Trending";
import QuestionView from "./dashboard/question/QuestionView";
import Profile from "./dashboard/profile/Profile";
import Editor from "./dashboard/editor/Editor";
import Login from "./home/Login";
import Activity from "./dashboard/activity/Activity";
import Quests from "./dashboard/quests/Quests";
import MyQuestions from "./dashboard/MyQuestions";
import ConsentBanner from "../components/consentbanner/ConsentBanner";
import axios from "axios";

// internationalization resources
const resources = {
	en: {
		translation: translationEN
	}
}

// internationalization setup
i18n.use(detector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		interpolation: {
			escapeValue: false
		}
	});

// axios setup for fetching backend data
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.timeout = 6000;

/**
 * Renders the app and takes care of choosing the appropriate language and theme
 */
export default function App() {
	const prefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');
	const prefersLightTheme = useMediaQuery('(prefers-color-scheme: light)');
	
	let themePreference: "dark" | "light" | undefined = undefined;
	if (prefersDarkTheme) themePreference = "dark";
	else if (prefersLightTheme) themePreference = "light";
	
	const [theme, setTheme] = React.useState<"dark" | "light" | "system">(
		(localStorage.getItem("theme") as "dark" | "light" | "system" || "system") ?? "system"
	);
	
	useEffect(() => {
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
				let value = theme === "dark" || (theme === "system" && themePreference === "dark")
					? getComputedStyle(document.documentElement).getPropertyValue(`${ variable }-dark`)
					: getComputedStyle(document.documentElement).getPropertyValue(`${ variable }-light`);
				root.setProperty(variable, value);
			});
			
			// update meta theme
			let meta = document.querySelector("meta[name=theme-color]") as HTMLMetaElement;
			if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--background-color-primary");
		}
		
		updateThemeVariables();
	}, [theme, themePreference]);
	
	useEffect(() => {
		const updateThemePreference = (matches: boolean) => {
			if (theme === "system")
				setTheme(matches ? "dark" : "light");
		}
		
		window.matchMedia('(prefers-color-scheme: dark)')
			  .addEventListener('change', ({ matches }) => updateThemePreference(matches));
		
		return () => window.matchMedia('(prefers-color-scheme: dark)')
						   .removeEventListener('change', ({ matches }) => updateThemePreference(matches));
	}, [theme]);
	
	const updateTheme = (theme: "system" | "dark" | "light") => {
		if (localStorage.getItem("consent") === "true")
			localStorage.setItem("theme", theme);
		setTheme(theme);
	}
	
	const skeletonBaseColor = theme === "system"
		? (themePreference === "light" ? "#dadada" : "#333")
		: (theme === "light" ? "#dadada" : "#333");
	const skeletonHighlightColor = theme === "system"
		? (themePreference === "light" ? "#f5f5f5" : "#101010")
		: (theme === "light" ? "#f5f5f5" : "#101010");
	
	return <SkeletonTheme baseColor={ skeletonBaseColor }
						  highlightColor={ skeletonHighlightColor }>
		<ConsentBanner/>
		
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
				<Route path={ "new" } element={ <Suspense><Editor/></Suspense> }/>
				<Route path={ "activity" } element={ <Suspense><Activity/></Suspense> }/>
				<Route path={ "my" } element={ <Suspense><MyQuestions/></Suspense> }/>
				<Route path={ "quests" } element={ <Suspense><Quests/></Suspense> }/>
				
				<Route path={ "*" } element={ <Navigate to={ "" }/> }/>
			</Route>
			
			<Route path={ "*" } element={ <Navigate to={ "" }/> }/>
		</Routes>
	</SkeletonTheme>;
}
