import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from "./pages/App";
import { Provider as AlertProvider } from 'react-alert';
import { BrowserRouter } from "react-router-dom";

// the style contains only the margin given as offset
// options contains all alert given options
// message is the alert message
// close is a function that closes the alert
// @ts-ignore
const renderAlertTemplate = ({ style, options, message, close }) => (
	<div className={ "alert alert-" + (options.type ?? "info") } style={ style }>
		{ options.type === 'info' && <i className={ "fi fi-rr-triangle-warning alert-icon" }/> }
		{ options.type === 'success' && <i className={ "fi fi-rr-trophy alert-icon" }/> }
		{ options.type === 'error' && <i className={ "fi fi-rr-exclamation alert-icon" }/> }
		
		<p>{ message }</p>
		
		<i className={ "fi fi-rr-circle-xmark alert-close" } onClick={ close }/>
	</div>
)

// render the app inside the root div in ../public/index.html
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<AlertProvider template={ renderAlertTemplate } offset={ "var(--spacing)" } timeout={ 6000 }>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</AlertProvider>
);
