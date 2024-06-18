import React from "react";
import "./Editor.scss";
import LiveInput from "../../../components/liveinput/LiveInput";
import Button from "../../../components/button/Button";
import TextEditor from "../../../components/texteditor/TextEditor";
import { useTranslation } from "react-i18next";
import { useAlert } from "react-alert";
import { axiosError } from "../../../def/axios-error";
import { useNavigate } from "react-router-dom";
import ButtonGroup from "../../../components/buttongroup/ButtonGroup";

/**
 * Renders the editor page used to ask a new question
 */
export default function Editor(props: {}) {
	const { t } = useTranslation();
	const alert = useAlert();
	const navigate = useNavigate();
	
	const [title, setTitle] = React.useState("");
	const [tags, setTags] = React.useState<string[]>([]);
	const [description, setDescription] = React.useState("Describe your question in more detail.");
	const [questionType, setQuestionType] = React.useState<"simp" | "users">("simp");
	const [selectedAI, setSelectedAI] = React.useState<"gpt" | "wolframAlpha">("chatgpt");
	
	const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
	
	const isTagsValid = tags.length > 0 && tags.length <= 5;
	
	return <>
		<section className={ "container editor-container transparent focus-indicator" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>1.</span>
				<span className={ "caption" }>{ t('dashboard.questionEditor.title.caption') }</span>
			</div>
			
			<input type={ "text" } id={ "editor-question-title" }
				   minLength={ 4 } maxLength={ 50 } required
				   onInput={ (e) => {
					   let title = (e.target as HTMLInputElement).value.trim();
					   while (title.includes("  ")) title = title.replace("  ", " ");
					   setTitle(title);
				   } }
				   onFocus={ (e) => {
					   window.setTimeout(() => document.execCommand('selectAll', false, undefined), 1);
				   } }
				   onBlur={ (e) => e.currentTarget.value = title }
				   placeholder={ t('dashboard.questionEditor.title.placeholder') }/>
		</section>
		
		<section className={ "container editor-container transparent focus-indicator" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>2.</span>
				<span className={ "caption" }>{ t('dashboard.questionEditor.tags.caption') }</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "fi fi-rr-tags" }/>
					{ t('dashboard.questionEditor.tags.title') }
				</h2>
				<p>{ t('dashboard.questionEditor.tags.hint') }</p>
				<hr/>
				
				<div style={ { display: "flex", gap: "var(--spacing)" } }>
					<LiveInput placeholder={ t('dashboard.questionEditor.tags.placeholder') }
							   onSuggestionSelected={ (s) => setTags([...tags, s]) }
							   onSuggestionDeselected={ (s) => setTags(tags.filter(t => t !== s)) }
							   disabled={ hasBeenSubmitted || tags.length >= 5 }
							   selectedSuggestions={ tags }/>
					<p className={ "tags tags-deletable" } style={ { alignSelf: "center" } }>
						{ tags.map((tag, index) => (
							<span key={ index }
								  className={ "badge" }
								  style={ { cursor: "pointer", outlineOffset: "var(--outline-width)" } }
								  tabIndex={ 0 }
								  onClick={ () => {
									  setTags(tags.filter(t => t !== tag));
								  } }
								  onKeyDown={ (e) => {
									  if (e.key === "Enter")
										  setTags(tags.filter(t => t !== tag));
								  } }>{ tag }</span>
						)) }
					</p>
				</div>
			</div>
		</section>
		
		<section className={ "container editor-container transparent focus-indicator" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>3.</span>
				<span className={ "caption" }>{ t('dashboard.questionEditor.description.caption') }</span>
			</div>
			
			<div style={ { flex: 1 } }>
				<TextEditor height={ "240px" } disabled={ hasBeenSubmitted } onInput={ setDescription }
							placeholder={ t('dashboard.questionEditor.description.placeholder') }/>
			</div>
		</section>
		
		<section className={ "container editor-container transparent" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>4.</span>
				<span className={ "caption" }>{ t('dashboard.questionEditor.type.caption') }</span>
			</div>
			
			<div className={ "glass editor-question-type-select" + (questionType === "simp" ? " selected" : "") }
				 onClick={ () => {
					 if (hasBeenSubmitted) return;
					 setQuestionType("simp");
				 } }>
				<i className={ "fi fi-sr-brain icon-test" } style={ { fontSize: "2em" } }/>
				<h3>{ t('dashboard.questionEditor.type.simp.title') }</h3>
				<p>{ t('dashboard.questionEditor.type.simp.hint') }</p>
				
				<span className={ "caption" }>{ t('dashboard.questionEditor.type.simp.model') }</span>
				
				<ButtonGroup style={ { marginTop: "calc(var(--spacing) / -2)" } }>
					<Button buttonStyle={ selectedAI === "gpt" ? "primary" : "glass" }
							onClick={ async () => setSelectedAI("gpt") }>
						ChatGPT
					</Button>
					<Button buttonStyle={ selectedAI === "wolframAlpha" ? "primary" : "glass" }
							onClick={ async () => setSelectedAI("wolframAlpha") }>
						Wolfram Alpha
					</Button>
				</ButtonGroup>
			</div>
			
			<div className={ "glass editor-question-type-select" + (questionType === "users" ? " selected" : "") }
				 onClick={ () => {
					 if (hasBeenSubmitted) return;
					 setQuestionType("users");
				 } }>
				<i className={ "fi fi-sr-user icon-test" } style={ { fontSize: "2em" } }/>
				<h3>{ t('dashboard.questionEditor.type.users.title') }</h3>
				<p>{ t('dashboard.questionEditor.type.users.hint') }</p>
			</div>
		</section>
		
		<div className={ "container editor-container transparent" } style={ { display: "flex" } }>
			<div style={ { flex: 1 } }/>
			<Button buttonStyle={ "primary" } iconLeft={ "fi fi-rr-paper-plane" }
					onClick={ async () => {
						setHasBeenSubmitted(true);
						
						await global.axios.post("question/create", {
							title: title,
							tags: tags,
							content: description,
							useAI: questionType === "simp" ? selectedAI : undefined
						}, {
							withCredentials: true
						})
									.then(res => navigate("/dashboard/question/" + res.data.id))
									.catch(err => axiosError(err, alert));
						
						setHasBeenSubmitted(false);
					} }
					disabled={ !isTagsValid || hasBeenSubmitted }>
				{ t('dashboard.questionEditor.submit') }
			</Button>
		</div>
	</>;
}
