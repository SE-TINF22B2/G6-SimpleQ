import React, { useEffect } from "react";
import "./TextEditor.scss";
import { useTranslation } from "react-i18next";

interface Props {
	height?: string;
	disabled?: boolean;
	children?: React.ReactNode;
	shouldClearContent?: boolean;
	setShouldClearContent?: (b: boolean) => void;
	onInput?: (value: string) => void;
	placeholder?: string;
}

/**
 * Renders a text editor with rich text buttons and a word counter
 * @param props.height Optional height setting (e.g. "200px"), default is auto, a scrollbar will be visible when set
 * @param props.disabled Optional boolean to dísabling manipulation of the text
 * @param props.children Optional ReactNode representing the content of the text editor
 * @param props.shouldClearContent Optional function to allow the parent to clear the text editor
 * @param props.setShouldClearContent Optional function to tell the parent that the text editor has been cleared
 * @param props.onInput() Optional function to be executed once the user makes an input
 * @param props.placeholder Optional string as placeholder for when the text editor is blank
 */
export default function TextEditor(props: Props) {
	const { t } = useTranslation();
	
	const [editorRef, setEditorRef] = React.useState<HTMLParagraphElement | undefined>(undefined);
	const [wordCount, setWordCount] =
		React.useState(props.children ? (props.children as string).split(" ").length : 0);
	
	useEffect(() => {
		if (editorRef && props.shouldClearContent && props.setShouldClearContent) {
			editorRef.innerHTML = "";
			props.setShouldClearContent(false);
		}
	}, [editorRef, props]);
	
	return <div className={ "text-editor" } onClick={ _ => editorRef?.focus() }>
		<div className={ "text-editor-buttons" }>
			<button title={ "Bold" } onClick={ () => document.execCommand("bold", false) }>
				<i className={ "fi fi-rr-bold" }/></button>
			<button title={ "Italic" } onClick={ () => document.execCommand("italic", false) }>
				<i className={ "fi fi-rr-italic" }/></button>
			<button title={ "Underline" } onClick={ () => document.execCommand("underline", false) }>
				<i className={ "fi fi-rr-underline" }/></button>
			<button title={ "Strikethrough" } onClick={ () => document.execCommand("strikeThrough", false) }>
				<i className={ "fi fi-rr-strikethrough" }/></button>
			
			<span/>
			
			<button title={ "Justify Left" } onClick={ () => document.execCommand("justifyLeft", false) }>
				<i className={ "fi fi-rr-align-left" }/></button>
			<button title={ "Justify Center" } onClick={ () => document.execCommand("justifyCenter", false) }>
				<i className={ "fi fi-rr-align-center" }/></button>
			<button title={ "Justify Right" } onClick={ () => document.execCommand("justifyRight", false) }>
				<i className={ "fi fi-rr-symbol" }/></button>
			<button title={ "Justify Block" } onClick={ () => document.execCommand("justifyFull", false) }>
				<i className={ "fi fi-rr-align-justify" }/></button>
			
			<span/>
			
			<button title={ "Undo" } onClick={ () => document.execCommand("undo", false) }>
				<i className={ "fi fi-rr-undo" }/></button>
			<button title={ "Redo" } onClick={ () => document.execCommand("redo", false) }>
				<i className={ "fi fi-rr-redo" }/></button>
		
		</div>
		
		<p ref={ (_p) => _p && setEditorRef(_p) }
		   className={ "text-editor-content" }
		   contentEditable={ !(props.disabled) }
		   suppressContentEditableWarning={ true }
		   data-placeholder={ props.placeholder }
		   onInput={ (e) => {
			   setWordCount((e.target as HTMLSpanElement).innerText.split(" ").length);
			   if (props.onInput) props.onInput((e.target as HTMLSpanElement).innerHTML);
		   } }
		   style={ { height: props.height ?? "auto" } }
		   onClick={ (e) => e.stopPropagation() }>
			{ props.children }
		</p>
		
		<p className={ "caption text-editor-caption" }>
			{ t('components.textEditor.wordCount', { count: wordCount }) }
		</p>
	</div>
}
