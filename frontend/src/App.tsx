import React from 'react';
import './App.css';
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

function App() {
    return <BrowserRouter>
        <nav>
            <div>
                <p>simpleQ</p>
            </div>
            <NavLink to="/"><i className={ "fas fa-question" }/>Trending Questions</NavLink>
            <NavLink to="/about"><i className={ "fas fa-fire" }/>My Activity</NavLink>
            <NavLink to="/about"><i className={ "fas fa-star" }/>My Favorites</NavLink>
            <NavLink to="/about"><i className={ "fas fa-toolbox" }/>Daily Quests</NavLink>
            <NavLink to="/about"><i className={ "fas fa-bell" }/>Inbox</NavLink>
        </nav>
        
        <main>
            <Routes>
                <Route path="/" element={ <div className={ "container" }><h1>Home</h1></div> }/>
                <Route path="/about" element={ <h1>About</h1> }/>
            </Routes>
        </main>
    </BrowserRouter>
}

export default App;
