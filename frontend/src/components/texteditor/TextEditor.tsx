import React from "react";
import "./TextEditor.scss";
import { useTranslation } from "react-i18next";

interface Props {
	height?: string;
	disabled?: boolean;
	children?: React.ReactNode;
	onInput?: (value: string) => void;
}

/**
 * Renders a text editor with rich text buttons and a word counter
 * @param props.height Optional height setting (e.g. "200px"), default is auto, a scrollbar will be visible when set
 * @param props.disabled Optional boolean to dísabling manipulation of the text
 * @param props.children Optional ReactNode representing the content of the text editor
 * @param props.onInput() Optional function to be executed once the user makes an input
 */
export default function TextEditor(props: Props) {
	const { t } = useTranslation();
	
	const [wordCount, setWordCount] =
		React.useState(props.children ? (props.children as string).split(" ").length : 0);
	
	return <div className={ "text-editor" }>
		<div className={ "text-editor-buttons" }>
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
		
		<p className={ "text-editor-content" }
		   contentEditable={ !(props.disabled) }
		   onInput={ (e) => {
			   setWordCount((e.target as HTMLSpanElement).innerText.split(" ").length);
			   if (props.onInput) props.onInput((e.target as HTMLSpanElement).innerHTML);
		   } }
		   style={ { height: props.height ?? "auto" } }>
			{ props.children }
		</p>
		
		<p className={ "caption text-editor-caption" }>
			{ t('components.textEditor.wordCount', { count: wordCount }) }
		</p>
	</div>
}
