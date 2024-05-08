import React from "react";
import "./Editor.scss";
import LiveInput from "../components/LiveInput";

export default function Editor(props: {}) {
	const [title, setTitle] = React.useState("New Question");
	const [tags, setTags] = React.useState<string[]>([]);
	const [description, setDescription] = React.useState("Describe your question in more detail.");
	const [questionType, setQuestionType] = React.useState<"simp" | "users">("simp");
	
	const isTitleValid = () => {
		return title.length > 5;
	}
	
	const isTagsValid = () => {
		return tags.length > 0 && tags.length <= 5;
	}
	
	const isDescriptionValid = () => {
		return (document.getElementById("question-editor")?.innerText.split(" ").length ?? 0) >= 20;
	}
	
	return <>
		<section className={ "container editor-container transparent focus-indicator" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>1.</span>
				<span className={ "caption" }>Title</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "far fa-question" }/>
					<span id={ "editor-question-title" }
						  contentEditable={ "plaintext-only" }
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
                            New Question
                    </span>
					?
				</h2>
				<p style={ { marginBottom: "calc(var(--spacing) / 2)" } }>What's your programming question? Be
					specific.</p>
			</div>
		</section>
		
		<section className={ "container editor-container transparent focus-indicator" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>2.</span>
				<span className={ "caption" }>Tags</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "fas fa-tag" }/>
					Tags
				</h2>
				<p>Add up to 5 tags to describe what your question is about.</p>
				<hr/>
				
				<div style={ { display: "flex", gap: "var(--spacing)" } }>
					<LiveInput placeholder={ "Add a tag" }
							   onSuggestionSelected={ (s) => setTags([...tags, s]) }
							   disabled={ tags.length >= 5 }/>
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
				<span className={ "caption" }>Description</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "fas fa-align-left" }/>
					Description
				</h2>
				<p>Describe your question in more detail.</p>
				<hr/>
				
				<div className={ "rich-text-buttons" }>
					<button onClick={ () => document.execCommand("bold", false) }>
						<i className={ "fas fa-bold" }/></button>
					<button onClick={ () => document.execCommand("italic", false) }>
						<i className={ "fas fa-italic" }/></button>
					<button onClick={ () => document.execCommand("underline", false) }>
						<i className={ "fas fa-underline" }/></button>
					<button onClick={ () => document.execCommand("strikeThrough", false) }>
						<i className={ "fas fa-strikethrough" }/></button>
					
					<span/>
					
					<button onClick={ () => document.execCommand("insertOrderedList", false) }>
						<i className={ "fas fa-list-ol" }/></button>
					<button onClick={ () => document.execCommand("insertUnorderedList", false) }>
						<i className={ "fas fa-list-ul" }/></button>
					
					<span/>
					
					<button onClick={ () => document.execCommand("justifyLeft", false) }>
						<i className={ "fas fa-align-left" }/></button>
					<button onClick={ () => document.execCommand("justifyCenter", false) }>
						<i className={ "fas fa-align-center" }/></button>
					<button onClick={ () => document.execCommand("justifyRight", false) }>
						<i className={ "fas fa-align-right" }/></button>
					<button onClick={ () => document.execCommand("justifyFull", false) }>
						<i className={ "fas fa-align-justify" }/></button>
					
					<span/>
					
					<button onClick={ () => document.execCommand("undo", false) }>
						<i className={ "fas fa-undo" }/></button>
					<button onClick={ () => document.execCommand("redo", false) }>
						<i className={ "fas fa-redo" }/></button>
				
				</div>
				<p id={ "question-editor" }
				   contentEditable
				   onInput={ (e) => {
					   setDescription((e.target as HTMLSpanElement).innerHTML);
				   } }>
					Describe your question in more detail.
				</p>
				<span className={ "caption" }>
                    You have written {
					document.getElementById("question-editor")?.innerText.split(" ").length
				} words ({
					document.getElementById("question-editor")?.innerText.length
				} characters)
                </span>
			</div>
		</section>
		
		<section className={ "container editor-container transparent" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>4.</span>
				<span className={ "caption" }>Customize Answers</span>
			</div>
			
			<div className={ "glass editor-question-type-select" + (questionType === "simp" ? " selected" : "") }
				 onClick={ () => setQuestionType("simp") }>
				<i className={ "fas fa-2xl fa-brain icon-test" }/>
				<h3>Enable Simp</h3>
				<p>Users, as well as our in-house AI chatbot will be able to reply to your question to help provide
					you with the best possible help.</p>
			</div>
			
			<div className={ "glass editor-question-type-select" + (questionType === "users" ? " selected" : "") }
				 onClick={ () => setQuestionType("users") }>
				<i className={ "far fa-2xl fa-user icon-test" }/>
				<h3>Only Users</h3>
				<p>Only Users will be able to upload answers to your question.</p>
			</div>
		</section>
		
		<section className={ "container editor-container transparent" }>
			<div className={ "editor-hints" }>
				<span className={ "hint-number" }>5.</span>
				<span className={ "caption" }>Validate</span>
			</div>
			
			<div className={ "glass" }>
				<h2>
					<i className={ "fas fa-check" }/>
					Check Your Question
				</h2>
				<p>Verify that you have created your question correctly.</p>
				<hr/>
				
				<table>
					<tbody>
					<tr>
						<td><i className={ "fas fa-" + (isTitleValid() ? "check" : "x") }
							   style={ { width: "40px", textAlign: "center" } }/></td>
						<td style={ { paddingLeft: "calc(var(--spacing) / 2)" } }>A valid title</td>
					</tr>
					<tr>
						<td><i className={ "fas fa-" + (isTagsValid() ? "check" : "x") }
							   style={ { width: "40px", textAlign: "center" } }/></td>
						<td style={ { paddingLeft: "calc(var(--spacing) / 2)" } }>At least one tag</td>
					</tr>
					<tr>
						<td><i className={ "fas fa-" + (isDescriptionValid() ? "check" : "x") }
							   style={ { width: "40px", textAlign: "center" } }/></td>
						<td style={ { paddingLeft: "calc(var(--spacing) / 2)" } }>A detailed description of at least
							20
							words
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</section>
		
		<div className={ "container editor-container transparent" } style={ { display: "flex" } }>
			<div style={ { flex: 1 } }/>
			<button className={ "btn btn-primary" }>
				<i className={ "fas fa-paper-plane" }/>
				<span>Post Your Question</span>
			</button>
		</div>
	</>;
}
