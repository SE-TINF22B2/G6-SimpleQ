import React from "react";
import "./Editor.scss";
import LiveInput from "../components/LiveInput";
import Button from "../components/Button";
import TextEditor from "../components/TextEditor";
import { useTranslation } from "react-i18next";

export default function Editor(props: {}) {
	const { t } = useTranslation();
	
	const [title, setTitle] = React.useState("New Question");
	const [tags, setTags] = React.useState<string[]>([]);
	const [description, setDescription] = React.useState("Describe your question in more detail.");
	const [questionType, setQuestionType] = React.useState<"simp" | "users">("simp");
	
	const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
	
	const isTitleValid = title.length > 5;
	const isTagsValid = tags.length > 0 && tags.length <= 5;
	const isDescriptionValid = description.split(" ").length >= 20;
	
	return <>
		<section className={ "container editor-container transparent focus-indicator" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>1.</span>
				<span className={ "caption" }>{ t('dashboard.questionEditor.title.caption') }</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "far fa-question" }/>
					<span id={ "editor-question-title" }
						  contentEditable={ hasBeenSubmitted ? false : "plaintext-only" }
						  onInput={ (e) => {
							  let title = (e.target as HTMLSpanElement).innerText.trim();
							  while (title.includes("  ")) title = title.replace("  ", " ");
							  setTitle(title);
						  } }
						  onBlur={ (e) => {
							  let elem = document.getElementById("editor-question-title");
							  if (elem) elem.innerText = title;
						  } }
						  defaultValue={ "New Question" }
						  style={ {
							  borderRadius: "var(--border-radius)",
							  outlineOffset: "var(--outline-width)"
						  } }>
                            { t('dashboard.questionEditor.title.placeholder') }
                    </span>
					?
				</h2>
				<p style={ { marginBottom: "calc(var(--spacing) / 2)" } }>{ t('dashboard.questionEditor.title.hint') }</p>
			</div>
		</section>
		
		<section className={ "container editor-container transparent focus-indicator" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>2.</span>
				<span className={ "caption" }>{ t('dashboard.questionEditor.tags.caption') }</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "fas fa-tag" }/>
					{ t('dashboard.questionEditor.tags.title') }
				</h2>
				<p>{ t('dashboard.questionEditor.tags.hint') }</p>
				<hr/>
				
				<div style={ { display: "flex", gap: "var(--spacing)" } }>
					<LiveInput placeholder={ t('dashboard.questionEditor.tags.placeholder') }
							   onSuggestionSelected={ (s) => setTags([...tags, s]) }
							   disabled={ hasBeenSubmitted || tags.length >= 5 }/>
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
			
			<div className={ "glass" }>
				<h2>
					<i className={ "fas fa-align-left" }/>
					{ t('dashboard.questionEditor.description.title') }
				</h2>
				<p>{ t('dashboard.questionEditor.description.hint') }</p>
				<hr/>
				
				<TextEditor height={ "240px" } disabled={ hasBeenSubmitted } onInput={ setDescription }>
					{ t('dashboard.questionEditor.description.placeholder') }
				</TextEditor>
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
				<i className={ "fas fa-2xl fa-brain icon-test" }/>
				<h3>{ t('dashboard.questionEditor.type.simp.title') }</h3>
				<p>{ t('dashboard.questionEditor.type.simp.hint') }</p>
			</div>
			
			<div className={ "glass editor-question-type-select" + (questionType === "users" ? " selected" : "") }
				 onClick={ () => {
					 if (hasBeenSubmitted) return;
					 setQuestionType("users");
				 } }>
				<i className={ "far fa-2xl fa-user icon-test" }/>
				<h3>{ t('dashboard.questionEditor.type.users.title') }</h3>
				<p>{ t('dashboard.questionEditor.type.users.hint') }</p>
			</div>
		</section>
		
		<section className={ "container editor-container transparent" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>5.</span>
				<span className={ "caption" }>{ t('dashboard.questionEditor.validate.caption') }</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "fas fa-check" }/>
					{ t('dashboard.questionEditor.validate.title') }
				</h2>
				<p>{ t('dashboard.questionEditor.validate.hint') }</p>
				<hr/>
				
				<table>
					<tbody>
					<tr>
						<td><i className={ "fas fa-" + (isTitleValid ? "check" : "x") }
							   style={ { width: "40px", textAlign: "center" } }/></td>
						<td style={ { paddingLeft: "calc(var(--spacing) / 2)" } }>{ t('dashboard.questionEditor.validate.checks.title') }</td>
					</tr>
					<tr>
						<td><i className={ "fas fa-" + (isTagsValid ? "check" : "x") }
							   style={ { width: "40px", textAlign: "center" } }/></td>
						<td style={ { paddingLeft: "calc(var(--spacing) / 2)" } }>{ t('dashboard.questionEditor.validate.checks.tags') }</td>
					</tr>
					<tr>
						<td><i className={ "fas fa-" + (isDescriptionValid ? "check" : "x") }
							   style={ { width: "40px", textAlign: "center" } }/></td>
						<td style={ { paddingLeft: "calc(var(--spacing) / 2)" } }>{ t('dashboard.questionEditor.validate.checks.description') }</td>
					</tr>
					</tbody>
				</table>
			</div>
		</section>
		
		<div className={ "container editor-container transparent" } style={ { display: "flex" } }>
			<div style={ { flex: 1 } }/>
			<Button style={ "primary" } icon={ "fas fa-paper-plane" }
					onClick={ () => {
						setHasBeenSubmitted(true);
						
						// Todo: Remove this timeout
						setTimeout(() => setHasBeenSubmitted(false), 1000);
					} }
					disabled={ !isTitleValid || !isTagsValid || !isDescriptionValid }>
				{ t('dashboard.questionEditor.submit') }
			</Button>
		</div>
	</>;
}
