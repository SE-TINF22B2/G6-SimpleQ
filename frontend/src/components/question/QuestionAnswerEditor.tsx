import React from "react";
import Section from "../section/Section";
import TextEditor from "../texteditor/TextEditor";
import Button from "../button/Button";
import { useTranslation } from "react-i18next";

/**
 * Renders the answer editor to be displayed in the question view
 * @param props onSubmit of the text editor
 */
export default function QuestionAnswerEditor(props: { onSubmit?: (content: string) => Promise<void> }) {
	const { t } = useTranslation()
	
	const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
	const [content, setContent] = React.useState("");
	
	return <Section className={ "transparent" } style={ { alignItems: "stretch" } }>
		<div style={ { display: "flex", flexDirection: "column", alignItems: "center" } }>
			<i className={ "fi fi-rr-comment avatar" }
			   style={ {
				   fontSize: "1.2em",
				   color: "var(--primary-color-contrast)",
				   background: "var(--primary-color)"
			   } }/>
			
			<div style={ {
				flex: 1,
				marginTop: "calc(-40px - var(--spacing))",
				width: "var(--outline-width)",
				background: "var(--border-color)",
				borderRadius: "var(--border-radius)"
			} }/>
		</div>
		
		<div style={ { width: "100%" } }>
			<h2 style={ { marginBottom: "calc(var(--spacing) / 2)" } }>
				{ t('dashboard.questionView.answerEditor.title') }
			</h2>
			
			<TextEditor placeholder={ t('dashboard.questionView.answerEditor.placeholder') } onInput={ setContent }
						disabled={ hasBeenSubmitted }/>
			
			<div style={ { marginTop: "var(--spacing)" } }/>
			<Button buttonStyle={ "primary" } icon={ "fi fi-rr-paper-plane" }
					onClick={ async () => {
						setHasBeenSubmitted(true);
						if (props.onSubmit) await props.onSubmit(content);
						setHasBeenSubmitted(false);
					} }>
				Submit
			</Button>
		</div>
	</Section>
}
