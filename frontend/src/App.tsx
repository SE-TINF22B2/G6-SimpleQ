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
            <NavLink to="/a"><i className={ "fas fa-fire" }/>My Activity</NavLink>
            <NavLink to="/b"><i className={ "fas fa-star" }/>My Favorites</NavLink>
            <NavLink to="/c"><i className={ "fas fa-toolbox" }/>Daily Quests</NavLink>
            <NavLink to="/d"><i className={ "fas fa-bell" }/>Inbox</NavLink>
        </nav>
        
        <main>
            <div className={ "container top-bar" }>
                <p className={ "search-bar" }><i className={ "fas fa-magnifying-glass" }/>Search..</p>
                
                <div style={ { display: "flex", flexDirection: "column" } }>
                    <p>Welcome back,</p>
                    <p>Benni</p>
                </div>
                
                <i className={ "fas fa-user-circle" }/>
            </div>
            
            <Routes>
                <Route path="/" element={ <div className={ "container" }><h1>Home</h1></div> }/>
                <Route path="/about" element={ <h1>About</h1> }/>
            </Routes>
        </main>
    </BrowserRouter>
}

export default App;
