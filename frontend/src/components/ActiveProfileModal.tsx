import { useAlert } from "react-alert";
import React, { useEffect } from "react";
import { ProfileDef } from "../def/ProfileDef";
import Modal from "react-responsive-modal";
import { axiosError } from "../def/axios-error";
import Skeleton from "react-loading-skeleton";
import Avatar from "./avatar/Avatar";

/**
 * The props for the active profile modal
 * @param activeProfileId the id of the user profile, used for the fetch, may be undefined to close modal
 * @param isOwner indicates whether the user is presented with options of updating the profile
 * @param closeModal callback function of closing the modal
 */
interface Props {
	activeProfileId: string | undefined,
	isOwner: boolean,
	closeModal: () => void
}

/**
 * Renders a modal providing relevant information about a given user
 */
export default function ActiveProfileModal(props: Props) {
	const alert = useAlert();
	
	const [activeProfile, setActiveProfile] = React.useState<ProfileDef | undefined>(undefined);
	
	useEffect(() => {
		if (!props.activeProfileId) return;
		
		setActiveProfile(undefined);
		
		global.axios.get<any>("profile/" + props.activeProfileId)
			  .then(res => setActiveProfile({
				  id: res.data.userId ?? "",
				  name: res.data.username ?? "",
				  type: res.data.accountState ?? "",
				  registrationDate: res.data.registrationDate ?? ""
			  }))
			  .catch(err => axiosError(err, alert));
	}, [alert, props.activeProfileId]);
	
	return <Modal open={ props.activeProfileId !== undefined } onClose={ props.closeModal }
				  classNames={ { overlay: "modal-overlay", modal: "modal-modal", closeButton: "modal-close" } } center>
		<div style={ { width: "100%", display: "grid", placeItems: "center" } }>
			{ activeProfile
				? <Avatar style={ { height: 100, width: 100 } }/>
				: <Skeleton height={ 100 } width={ 100 }/>
			}
			<h1>{ activeProfile?.name ?? <Skeleton width={ 200 }/> }</h1>
		</div>
	</Modal>
}
