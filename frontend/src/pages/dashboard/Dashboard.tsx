import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import BarChart from "../../components/barchart/BarChart";
import Dropdown from "../../components/dropdown/Dropdown";
import i18n from "i18next";

/* Todo: Make Logo Static */
import logoTodoMakeStatic from "../../images/logo-TODO-MAKE-STATIC.png";

import { Configuration, FrontendApi, Identity, Session } from "@ory/client"
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { axiosError } from "../../def/axios-error";
import { useAlert } from "react-alert";
import Avatar from "../../components/avatar/Avatar";
import { animateBlob } from "../../def/cool-blobs";
import Modal from "react-responsive-modal";
import Search from "../../components/search/Search";

// ory setup
const basePath = "http://localhost:4000"
const ory = new FrontendApi(
	new Configuration({
		basePath,
		baseOptions: {
			withCredentials: true,
		},
	}),
)

interface Props {
	updateTheme: (theme: "system" | "dark" | "light") => void;
}

/**
 * Renders the dashboard consisting of a navigation and an outlet for subordinate pages
 * @param props.updateTheme Function used to update the theme of the entire app
 */
export default function Dashboard(props: Props) {
	const alert = useAlert();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [session, setSession] = useState<Session | undefined>();
	const [logoutUrl, setLogoutUrl] = useState<string | undefined>();
	const [stats, setStats] = useState<{ streak: number, views: number, likes: number } | undefined>();
	const [history, setHistory] = useState<number[] | undefined>();
	const [activeQuestionName, setActiveQuestionName] = useState<string | undefined>();
	
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const [updateUsernamePrompt, setUpdateUsernamePrompt] = useState<string | undefined>(undefined);
	
	const getId = (identity?: Identity) => identity?.id;
	
	const getUserName = (identity?: Identity) =>
		identity?.traits.email || identity?.traits.username || t('dashboard.anonymous');
	
	useEffect(() => {
		const fetchProfile = () => {
			global.axios.get("profile", { withCredentials: true })
				  .then(res => {
					  console.log(res);
				  })
				  .catch(err => axiosError(err, alert));
			
			setUpdateUsernamePrompt("default username");
		}
		
		const fetchStats = () => {
			global.axios.get("stats", { withCredentials: true })
				  .then(res => console.log(res))
				  .catch(err => axiosError(err, alert));
			
			if (window.location.pathname.includes("/question")) {
				let questionId = window.location.pathname.split("/question/")[1].substring(0, 36);
				global.axios.get("question/" + questionId + "/title")
					  .then(res => setActiveQuestionName(res.data.title))
					  .catch(err => axiosError(err, alert));
			}
		}
		
		ory.toSession()
		   .then(({ data }) => {
			   // Todo: check whether this makes sense
			   if (localStorage.getItem("consent") === "true")
				   setSession(data);
			   
			   ory.createBrowserLogoutFlow().then(({ data }) => {
				   setLogoutUrl(data.logout_url);
			   });
			   
			   fetchProfile();
			   fetchStats();
		   })
		   .catch((err) => {
			   console.log("error logging in", err);
			   // window.location.replace(`${ basePath }/ui/login`);
		   });
		
		const onKeyDown = (e: any) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				setIsSearchModalOpen(_isSearchModalOpen => !_isSearchModalOpen);
				e.preventDefault();
			}
		}
		
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [alert]);
	
	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
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
			aspectRatio: "1",
			display: "grid",
			placeItems: "center",
			userSelect: "none",
			cursor: "pointer",
			borderRadius: "50%",
			boxShadow: "var(--box-shadow)"
		} }
									   tabIndex={ 0 }>
			<Avatar userId={ session?.identity?.id }/>
		</div> }
						 items={ [
							 {
								 icon: "fi fi-rr-user",
								 label: getUserName(session?.identity),
								 shortcut: <span className={ "badge" }>Pro</span>,
								 onClick: (closeDropdown) => {
									 navigate("/dashboard/profile");
									 closeDropdown();
								 },
								 hidden: session?.identity === undefined
							 },
							 {
								 icon: "fi fi-rr-sign-in-alt",
								 label: t('dashboard.login'),
								 onClick: () => window.location.replace(`${ basePath }/ui/login?return_to=` + encodeURIComponent(window.location.href)),
								 hidden: session?.identity !== undefined
							 },
							 {
								 icon: "fi fi-rr-sign-out-alt",
								 label: t('dashboard.logout'),
								 onClick: () => window.location.href = (
									 logoutUrl
										 ? (logoutUrl + (logoutUrl.includes("?") ? "&" : "?") + "return_to=" + encodeURIComponent(window.location.href))
										 : "/"
								 ),
								 hidden: session?.identity === undefined
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
		
		
		<UpdateUsernamePrompt identity={ session?.identity } currentUsername={ updateUsernamePrompt }
							  closeModal={ () => setUpdateUsernamePrompt(undefined) }/>
		
		
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
			
			{ window.location.pathname.includes("/question") && <>
                <NavLink to={ window.location.pathname } className={ "active navigate" }
                         onClick={ (e) => animateBlob(e) }>
                    <i className={ "fi fi-sr-question-square" }/>
                    <p style={ { display: "flex", flexDirection: "column" } }>
                        <span className={ "caption" }>{ t('dashboard.nav.question.browsing') }</span>
                        <span>{ activeQuestionName ?? <Skeleton/> }</span>
                    </p>
                    <span className={ "button-blob" }/>
                </NavLink>
                
                <div style={ { paddingInline: "var(--spacing)" } }>
                    <hr style={ { marginBlock: 0 } }/>
                </div>
            </> }
			
			<NavLink to={ "trending" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-file-chart-line" }/>
					<span>{ t('dashboard.nav.trending') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			<NavLink to={ "new" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-edit" }/>
					<span>{ t('dashboard.nav.question.create') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			<NavLink to={ "activity" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-rectangle-vertical-history" }/>
					<span>{ t('dashboard.nav.activity') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			<NavLink to={ "my" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-rectangle-list" }/>
					<span>{ t('dashboard.nav.my') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			<NavLink to={ "b" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-star" }/>
					<span>{ t('dashboard.nav.favorites') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			<NavLink to={ "quests" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-treasure-chest" }/>
					<span>{ t('dashboard.nav.quests') }</span>
					<span className={ "button-blob" }/>
				</> }
			</NavLink>
			<NavLink to={ "d" } className={ "navigate" } onClick={ (e) => animateBlob(e) }>
				{ ({ isActive }) => <>
					<i className={ "fi fi-" + (isActive ? "s" : "r") + "r-envelope" }/>
					<span>{ t('dashboard.nav.inbox') }</span>
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
						<span>{ stats?.streak ?? <Skeleton width={ 20 }/> }</span>
					</div>
					<div className={ "stats-column" }>
						<i className={ "fi fi-rr-eye primary-icon" }/>
						<span>{ stats?.views ?? <Skeleton width={ 20 }/> }</span>
					</div>
					<div className={ "stats-column" }>
						<i className={ "fi fi-rr-social-network primary-icon" }/>
						<span>{ stats?.likes ?? <Skeleton width={ 20 }/> }</span>
					</div>
				</div>
				
				<hr/>
				<p className={ "caption" } style={ { textAlign: "center", marginBottom: "var(--spacing)" } }>
					{ t('dashboard.nav.activeDays') }
				</p>
				<BarChart data={ history }/>
			</div>
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

/**
 * Todo: do
 */
function UpdateUsernamePrompt(props: { identity?: Identity, currentUsername?: string, closeModal: () => void }) {
	const alert = useAlert();
	
	return <Modal open={ /* props.currentUsername !== undefined */ false } onClose={ props.closeModal }
				  classNames={ { overlay: "modal-overlay", modal: "modal-modal", closeButton: "modal-close" } } center>
		<div style={ { width: "100%", display: "grid", placeItems: "center" } }>
			<h1>Hello</h1>
			<p>Current username: { props.currentUsername }</p>
		</div>
	</Modal>
}
