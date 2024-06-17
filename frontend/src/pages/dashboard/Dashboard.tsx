import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import BarChart from "../../components/barchart/BarChart";
import Dropdown from "../../components/dropdown/Dropdown";
import i18n from "i18next";

/* Todo: Make Logo Static */
import logoTodoMakeStatic from "../../images/logo-TODO-MAKE-STATIC.png";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { useAlert } from "react-alert";
import Avatar from "../../components/avatar/Avatar";
import { animateBlob } from "../../def/cool-blobs";
import Search from "../../components/search/Search";
import { ProfileDef } from "../../def/ProfileDef";
import { Session } from "@ory/client";
import { QuestionDef } from "../../def/QuestionDef";
import { capitalizeFirstLetter } from "../../def/converter";

/**
 * Props of the dashboard
 * @param updateTheme Function used to update the theme of the entire app
 * @param profile Profile of the user that is currently logged in
 * @param session Session of the user
 * @param logoutUrl Url to logout
 * @param activeQuestion the question that is currently or has recently been visited
 */
interface Props {
	updateTheme: (theme: "system" | "dark" | "light") => void,
	profile?: ProfileDef,
	session?: Session,
	logoutUrl?: string,
	activeQuestion?: QuestionDef
}

/**
 * Renders the dashboard consisting of a navigation and an outlet for subordinate pages
 * @param props Props of the dashboard
 */
export default function Dashboard(props: Props) {
	const alert = useAlert();
	const { t } = useTranslation();
	const navigate = useNavigate();
	
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	
	/*
	const getId = (identity?: Identity) => identity?.id;
	
	const getUserName = (identity?: Identity) =>
		identity?.traits.email || identity?.traits.username || t('dashboard.anonymous');
	 */
	
	useEffect(() => {
		const onKeyDown = (e: any) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				setIsSearchModalOpen(_isSearchModalOpen => !_isSearchModalOpen);
				e.preventDefault();
			}
		}
		
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [alert]);
	
	const getSearchShortcut = () => {
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
	
	const loggedInDropdown = () => {
		return <Dropdown button={ <div style={ {
			userSelect: "none",
			cursor: "pointer",
			borderRadius: "50%",
			outlineOffset: "var(--outline-width)"
		} }
									   tabIndex={ 0 }>
			<Avatar userName={ props.profile?.name }/>
		</div> }
						 items={ [
							 {
								 icon: "fi fi-rr-user",
								 label: props.profile?.name ?? "Profile",
								 shortcut: <span className={ "badge" }>{ props.profile?.type }</span>,
								 onClick: (closeDropdown) => {
									 navigate("/dashboard/profile");
									 closeDropdown();
								 },
								 hidden: props.session?.identity === undefined
							 },
							 {
								 icon: "fi fi-rr-sign-in-alt",
								 label: t('dashboard.login'),
								 onClick: () => window.location.replace(`${ import.meta.env.VITE_ORY_URL }/ui/login?return_to=` + encodeURIComponent(window.location.href)),
								 hidden: props.session?.identity !== undefined
							 },
							 {
								 icon: "fi fi-rr-sign-out-alt",
								 label: t('dashboard.logout'),
								 onClick: () => window.location.href = (
									 props.logoutUrl
										 ? (props.logoutUrl + (props.logoutUrl.includes("?") ? "&" : "?") + "return_to=" + encodeURIComponent(window.location.href))
										 : "/"
								 ),
								 hidden: props.session?.identity === undefined
							 },
							 {
								 icon: "fi fi-rr-language",
								 label: t('dashboard.appearance.language.language'),
								 shortcut: i18n.language,
								 items: [
									 {
										 icon: "fi fi-rr-globe",
										 label: t('dashboard.appearance.language.english'),
										 onClick: () => i18n.changeLanguage("en"),
										 shortcut: i18n.language === "en" ?
											 <i className={ "fi fi-rr-check" }/> : ""
									 },
									 {
										 icon: "fi fi-rr-globe",
										 label: t('dashboard.appearance.language.german'),
										 onClick: () => i18n.changeLanguage("de"),
										 shortcut: i18n.language === "de" ?
											 <i className={ "fi fi-rr-check" }/> : ""
									 },
									 {
										 icon: "fi fi-rr-globe",
										 label: t('dashboard.appearance.language.french'),
										 onClick: () => i18n.changeLanguage("fr"),
										 shortcut: i18n.language === "fr" ?
											 <i className={ "fi fi-rr-check" }/> : ""
									 }
								 ],
								 divider: "top",
								 header: t('dashboard.appearance.appearance')
							 },
							 {
								 icon: "fi fi-rr-brush",
								 label: t('dashboard.appearance.theme.theme'),
								 shortcut: capitalizeFirstLetter(localStorage.getItem("theme") || "system"),
								 items: [
									 {
										 icon: "fi fi-rr-insight-alt",
										 label: t('dashboard.appearance.theme.system'),
										 onClick: () => props.updateTheme("system"),
										 shortcut: !localStorage.getItem("theme")
										 || localStorage.getItem("theme") === "system" ?
											 <i className={ "fi fi-rr-check" }/> : "",
										 divider: "bottom"
									 },
									 {
										 icon: "fi fi-rr-moon",
										 label: t('dashboard.appearance.theme.dark'),
										 onClick: () => props.updateTheme("dark"),
										 shortcut: localStorage.getItem("theme") === "dark" ?
											 <i className={ "fi fi-rr-check" }/> : ""
									 },
									 {
										 icon: "fi fi-rr-sun",
										 label: t('dashboard.appearance.theme.light'),
										 onClick: () => props.updateTheme("light"),
										 shortcut: localStorage.getItem("theme") === "light" ?
											 <i className={ "fi fi-rr-check" }/> : ""
									 }
								 ]
							 }
						 ] }/>
	}
	
	return <div className={ "dashboard" }>
		<Search isOpen={ isSearchModalOpen } closeModal={ () => setIsSearchModalOpen(false) }/>
		
		<nav>
			<div style={ { position: "relative", overflow: "hidden" } }>
				<NavLink to={ "/" }
						 style={ {
							 maxHeight: "80%",
							 maxWidth: "80%",
							 outlineColor: "var(--primary-color-contrast)",
							 borderRadius: "var(--border-radius)",
							 display: "grid",
							 placeItems: "center"
						 } }>
					<img src={ logoTodoMakeStatic } alt={ "Logo" }
						 height={ "80%" } width={ "80%" }
						 style={ { objectFit: "contain" } }/>
				</NavLink>
				
				<i className={ "fi fi-rr-circle-xmark toggle-nav" }
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
			
			{ props.activeQuestion && <>
                <NavLink to={ "question/" + props.activeQuestion.id } className={ "navigate" }
                         onClick={ (e) => animateBlob(e) }>
                    <i className={ "fi fi-" + (window.location.pathname.includes("/question") ? "s" : "r") + "r-question-square" }/>
                    <div className={ "nav-label" } style={ { display: "flex", flexDirection: "column" } }>
                        <p className={ "caption" }>
							{ window.location.pathname.includes("/question")
								? t('dashboard.nav.question.browsing.currently', { type: props.activeQuestion.isDiscussion ? t('components.question.type.discussion') : t('components.question.type.question') })
								: t('dashboard.nav.question.browsing.recently', { type: props.activeQuestion.isDiscussion ? t('components.question.type.discussion') : t('components.question.type.question') })
							}
                        </p>
                        <p style={ { marginTop: -4 } }>{ props.activeQuestion.title }</p>
                    </div>
                    <span className={ "button-blob" }/>
                </NavLink>
                
                <div style={ { paddingInline: "var(--spacing)" } }>
                    <hr style={ { marginBlock: 0 } }/>
                </div>
            </> }
			
			<NavLink to={ "trending" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-file-chart-line" }/>
					<span className={ "nav-label" }>{ t('dashboard.nav.trending') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			<NavLink to={ "new" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-edit" }/>
					<span className={ "nav-label" }>{ t('dashboard.nav.question.create') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			
			{ props.session !== undefined && <>
                <NavLink to={ "activity" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
					{ ({ isActive }) => <>
						<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-list-timeline" }/>
						<span className={ "nav-label" }>{ t('dashboard.nav.activity') }</span>
						<span className={ "button-blob" }/>
					</> }
                </NavLink>
                <NavLink to={ "my" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
					{ ({ isActive }) => <>
						<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-rectangle-list" }/>
						<span className={ "nav-label" }>{ t('dashboard.nav.my') }</span>
						<span className={ "button-blob" }/>
					</> }
                </NavLink>
                <NavLink to={ "b" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
					{ ({ isActive }) => <>
						<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-star" }/>
						<span className={ "nav-label" }>{ t('dashboard.nav.favorites') }</span>
						<span className={ "button-blob" }/>
					</> }
                </NavLink>
                <NavLink to={ "quests" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
					{ ({ isActive }) => <>
						<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-treasure-chest" }/>
						<span className={ "nav-label" }>{ t('dashboard.nav.quests') }</span>
						<span className={ "button-blob" }/>
					</> }
                </NavLink>
                <NavLink to={ "d" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
					{ ({ isActive }) => <>
						<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-envelope" }/>
						<span className={ "nav-label" }>{ t('dashboard.nav.inbox') }</span>
						<span className={ "button-blob" }/>
						<span className={ "badge" }>3</span>
					</> }
                </NavLink>
                
                <div style={ { flex: 1 } }/>
                <div style={ { paddingInline: "var(--spacing)" } }>
                    <hr/>
                    <p className={ "caption" } style={ { textAlign: "center", marginBottom: "var(--spacing)" } }>
						{ t('dashboard.nav.stats') }
                    </p>
                    <div className={ "stats" }>
                        <div className={ "stats-column" }>
                            <i className={ "fi fi-rr-flame primary-icon" }/>
                            <span>{ undefined ?? <Skeleton width={ 20 }/> }</span>
                        </div>
                        <div className={ "stats-column" }>
                            <i className={ "fi fi-rr-eye primary-icon" }/>
                            <span>{ undefined ?? <Skeleton width={ 20 }/> }</span>
                        </div>
                        <div className={ "stats-column" }>
                            <i className={ "fi fi-rr-social-network primary-icon" }/>
                            <span>{ undefined ?? <Skeleton width={ 20 }/> }</span>
                        </div>
                    </div>
                    
                    <hr/>
                    <p className={ "caption" } style={ { textAlign: "center", marginBottom: "var(--spacing)" } }>
						{ t('dashboard.nav.activeDays') }
                    </p>
                    <BarChart/>
                </div>
            </> }
		</nav>
		
		<main>
			<div className={ "container transparent top-bar" }>
				<i className={ "fi fi-rr-menu-burger glass toggle-nav" }
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
					   if (e.key === "Enter") setIsSearchModalOpen(true);
				   } }
				   id={ "search-bar" }
				   tabIndex={ 0 }
				   onClick={ () => setIsSearchModalOpen(true) }>
					<i className={ "fi fi-rr-search" }/>
					<span style={ {
						display: "flex",
						alignItems: "center"
					} }>{ t('dashboard.search.search') } { getSearchShortcut() }</span>
				</p>
				
				{ loggedInDropdown() }
			</div>
			
			<hr style={ { marginBlock: "0" } }/>
			
			<Outlet/>
		</main>
	</div>
}
