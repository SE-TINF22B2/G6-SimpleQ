import React, { Dispatch, useEffect } from "react";
import "./Profile.scss";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import Button from "../../../components/button/Button";
import { ProfileDef } from "../../../def/ProfileDef";
import Section from "../../../components/section/Section";
import Avatar from "../../../components/avatar/Avatar";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../def/converter";

interface Props {
	profile?: ProfileDef,
	setProfile?: Dispatch<undefined | ProfileDef | { (prevState: undefined | ProfileDef): (undefined | ProfileDef) }>
}

/**
 * Renders the profile page
 */
export default function Profile(props: Props) {
	const alert = useAlert();
	const { t } = useTranslation();
	
	const [updateUsernameInputValue, setUpdateUsernameInputValue] = React.useState("");
	
	useEffect(() => {
		setUpdateUsernameInputValue(props.profile?.name ?? "");
	}, [props.profile]);
	
	return <>
		<Section className={ "transparent" }>
			{ props.profile
				? <Avatar userName={ props.profile.name } style={ { height: 160, width: 160 } }/>
				: <Skeleton width={ 160 } height={ 160 } style={ { borderRadius: "50%" } }/>
			}
			<div style={ {
				flex: 1,
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				gap: "var(--spacing)"
			} }>
				<div style={ {
					display: "flex",
					alignItems: "flex-end",
					gap: "var(--spacing)",
					justifyContent: "space-between"
				} }>
					{ props.profile
						? <input id={ "test" }
								 minLength={ 4 } maxLength={ 20 }
								 style={ {
									 background: "transparent",
									 border: "var(--outline-width) solid var(--border-color)",
									 borderRadius: "var(--border-radius)",
									 fontSize: "2em",
									 padding: "calc(var(--spacing) / 2) var(--spacing)",
									 fontWeight: 700,
									 flex: 1
								 } }
								 placeholder={ "Username" }
								 value={ updateUsernameInputValue }
								 onChange={ (e) => setUpdateUsernameInputValue(e.target.value.trim()) }
								 onFocus={ (e) => {
									 window.setTimeout(() => document.execCommand('selectAll', false, undefined), 1);
								 } }/>
						: <h1><Skeleton width={ 400 }/></h1>
					}
					{ props.profile && <Button iconLeft={ "fi fi-rr-refresh" }
                                               disabled={ updateUsernameInputValue === props.profile.name || updateUsernameInputValue.length < 4 || updateUsernameInputValue.length > 20 }
                                               onClick={ async () => {
												   await global.axios.post("/profile/update", { name: updateUsernameInputValue }, { withCredentials: true })
															   .then(res => {
																   props.setProfile && props.setProfile({
																	   id: res.data.userId ?? "",
																	   name: res.data.username ?? "",
																	   type: res.data.accountState ?? "",
																	   registrationDate: res.data.registrationDate ?? ""
																   });
															   })
															   .catch(err => axiosError(err, alert));
											   } }>
                        Update
                    </Button> }
				</div>
				
				<div style={ { display: "flex", alignItems: "center", gap: "var(--spacing)" } }>
					<p className={ "badge" }>{ props.profile?.type ?? <Skeleton width={ 100 }/> }</p>
					<span>·</span>
					<p>{ props.profile
						? t('dashboard.profile.info.registrationDate', { registrationDate: formatDate(props.profile.registrationDate) })
						: <Skeleton width={ 200 }/>
					}</p>
				</div>
			</div>
		</Section>
		
		<hr style={ { marginBlock: 0 } }/>
		
		<Section className={ "transparent" }>
			<h2>{ t('dashboard.profile.auth.auth') }</h2>
		</Section>
		<Section>
			<p>{ t('dashboard.profile.auth.description') }</p>
			
			<Button iconLeft={ "fi fi-rr-user-key" }
					onClick={ async () => {
						window.location.replace(`${ import.meta.env.VITE_ORY_URL }/ui/settings?return_to=` + encodeURIComponent(window.location.href))
					} }
					style={ { marginTop: "var(--spacing)" } }>
				{ t('dashboard.profile.auth.redirect') }
			</Button>
		</Section>
	</>
}
