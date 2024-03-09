import React from "react";
import { NavLink } from "react-router-dom";

export default class Home extends React.Component<{}, {}> {
    render() {
        return <div>
            <h1>Home</h1>
            <p>Welcome to the home page</p>
            <NavLink to={ "dashboard" }>Dashboard</NavLink>
        </div>
    }
}
