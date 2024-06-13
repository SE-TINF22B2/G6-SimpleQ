import React, { useEffect } from "react";
import "./Profile.scss";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import Button from "../../../components/button/Button";
import { ProfileDef } from "../../../def/ProfileDef";
import Section from "../../../components/section/Section";
import Avatar from "../../../components/avatar/Avatar";
import Skeleton from "react-loading-skeleton";

/**
 * Renders the profile page, currently static
 */
export default function Profile(props: {}) {
	const alert = useAlert();
	
	const [profile, setProfile] = React.useState<ProfileDef | undefined>(undefined);
	const [updateUsernameInputValue, setUpdateUsernameInputValue] = React.useState("");
	
	useEffect(() => {
		global.axios.get<any>("profile", { withCredentials: true })
			  .then(res => {
				  setProfile({
					  id: res.data.userId ?? "",
					  name: res.data.username ?? "",
					  type: res.data.accountState ?? "",
					  registrationDate: res.data.registrationDate ?? ""
				  });
				  setUpdateUsernameInputValue(res.data.username ?? "");
			  })
			  .catch(err => axiosError(err, alert));
	}, [alert]);
	
	return <>
		<Section className={ "transparent" } style={ { flexDirection: "column" } }>
			{ profile
				? <Avatar userId={ profile.id } style={ { height: 200, width: 200 } }/>
				: <Skeleton width={ 200 } height={ 200 } style={ { borderRadius: "50%" } }/>
			}
			<div style={ { display: "flex", alignItems: "center", gap: "var(--spacing)" } }>
				{ profile
					? <input id={ "test" }
							 minLength={ 4 } maxLength={ 20 }
							 style={ {
								 background: "transparent",
								 border: "none",
								 borderRadius: "var(--border-radius)",
								 fontSize: "2em",
								 padding: "calc(var(--spacing) / 2) var(--spacing)",
								 fontWeight: 700,
								 width: 400
							 } }
							 placeholder={ "Username" }
							 value={ updateUsernameInputValue }
							 onChange={ (e) => setUpdateUsernameInputValue(e.target.value.trim()) }
							 onFocus={ (e) => {
								 window.setTimeout(() => document.execCommand('selectAll', false, undefined), 1);
							 } }/>
					: <h1><Skeleton width={ 400 }/></h1>
				}
				{ profile && <Button icon={ "fi fi-rr-refresh" }
                                     disabled={ updateUsernameInputValue === profile.name || updateUsernameInputValue.length < 4 || updateUsernameInputValue.length > 20 }
                                     onClick={ async () => {
										 await global.axios.post("/profile/update", { name: updateUsernameInputValue }, { withCredentials: true })
													 .then(res => {
														 setProfile({
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
			
			<p className={ "badge" }>{ profile?.type ?? <Skeleton width={ 100 }/> }</p>
			<p>{ profile?.registrationDate ?? <Skeleton width={ 200 }/> }</p>
		</Section>
	</>
}
