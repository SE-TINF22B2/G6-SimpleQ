import "./init";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from "./pages/App";
import { BrowserRouter } from "react-router-dom";

// render the app inside the root div in ../public/index.html
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<BrowserRouter>
	<App/>
</BrowserRouter>);
