import React from "react";
import "./Editor.scss";
import LiveInput from "../components/LiveInput";

export default class Editor extends React.Component<any, any> {
    render() {
        return <>
            <div className={ "container editor-container transparent focus-indicator" }>
                <div className={ "editor-hints" }>
                    <span className={ "hint-number" }>1</span>
                    <span className={ "caption" }>Title</span>
                </div>

                <div className={ "glass" }>
                    <h2>
                        <i className={ "far fa-question" }/>
                        <span id={ "editor-question-title" }
                              contentEditable={ "plaintext-only" }
                              onChange={ (e) => {
                                  // only plain text, thanks to Firefox <3
                                  setTimeout(() => {
                                      // @ts-ignore
                                      const text = e.target.innerText;
                                      // @ts-ignore
                                      e.target.innerText = text;
                                  }, 10);
                              } }
                              style={ {
                                  borderRadius: "var(--border-radius)",
                                  outlineOffset: "var(--outline-width)"
                              } }>
                        New Question
                    </span>
                    </h2>
                    <p style={ { marginBottom: "calc(var(--spacing) / 2)" } }>What's your programming question? Be
                                                                              specific.</p>
                </div>
            </div>

            <div className={ "container editor-container transparent focus-indicator" }>
                <div className={ "editor-hints" }>
                    <span className={ "hint-number" }>2</span>
                    <span className={ "caption" }>Tags</span>
                </div>

                <div className={ "glass" }>
                    <h2>
                        <i className={ "fas fa-tag" }/>
                        Tags
                    </h2>
                    <p>Add up to 5 tags to describe what your question is about.</p>
                    <hr style={ { marginBottom: "var(--spacing)" } }/>
                    <LiveInput placeholder={ "Add a tag" }/>
                </div>
            </div>

            <div className={ "container editor-container transparent focus-indicator" }>
                <div className={ "editor-hints" }>
                    <span className={ "hint-number" }>3</span>
                    <span className={ "caption" }>Description</span>
                </div>

                <div className={ "glass" }>
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
                       style={ {
                           width: "100%",
                           height: "240px",
                           marginBottom: "var(--spacing)",
                           borderRadius: "var(--border-radius)",
                           outlineOffset: "calc(var(--spacing) / 2)"
                       } }
                       contentEditable>
                        Describe your question in more detail.
                    </p>
                    <hr/>
                    <span className={ "caption" }>
                    You have written {
                        document.getElementById("question-editor")?.innerText.split(" ").length
                    } words ({
                        document.getElementById("question-editor")?.innerText.length
                    } characters)
                </span>
                </div>
            </div>

            <div className={ "container editor-container transparent" } style={ { display: "flex" } }>
                <div style={ { flex: 1 } }/>
                <button className={ "btn btn-primary" }>
                    <i className={ "fas fa-paper-plane" }/>
                    Post Your Question
                </button>
            </div>
        </>;
    }
}
