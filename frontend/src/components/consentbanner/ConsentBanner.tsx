import "./ConsentBanner.scss";
import { useState } from "react";
import Button from "../button/Button";
import { useTranslation } from "react-i18next";

/**
 * Renders the consent banner
 */
export default function ConsentBanner(props: {}) {
	const { t } = useTranslation();
	
	const [consentDismissed, setConsentDismissed] =
		useState<boolean>(localStorage.getItem("consentDismissed") === "true" || false);
	
	const giveConsent = () => {
		localStorage.setItem("consent", "true");
		
		setConsentDismissed(true);
		localStorage.setItem("consentDismissed", "true");
	}
	
	const revokeConsent = () => {
		localStorage.setItem("consent", "false");
		
		setConsentDismissed(true);
		localStorage.setItem("consentDismissed", "true");
	}
	
	if (consentDismissed) return null;
	
	return (
		<div className={ "consent-banner-wrapper" }>
			<div className={ "consent-banner" }>
				<h2>
					<i className={ "fi fi-rr-hdd" }/>
					{ t("components.consentBanner.title") }
				</h2>
				<p>
					{ t("components.consentBanner.content") }
				</p>
				<div className={ "consent-banner-buttons" }>
					<Button iconLeft={ "fi fi-rr-social-network" } buttonStyle={ "primary" } onClick={ giveConsent }>
						{ t("components.consentBanner.accept") }
					</Button>
					<Button iconLeft={ "fi fi-rr-social-network flipY" } onClick={ revokeConsent }>
						{ t("components.consentBanner.decline") }
					</Button>
				</div>
			</div>
		</div>
	);
}
