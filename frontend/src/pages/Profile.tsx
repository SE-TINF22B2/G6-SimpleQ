import React from "react";
import "./Profile.scss";

export default class Profile extends React.Component<any, any> {
    render() {
        return <>
            <div className={ "container" }>
                <h1>Profile</h1>
                <p>View and edit your profile.</p>
            </div>

            <div className={ "container profile-memberships" }>
                <h2>
                    <i className={ "fas fa-ranking-star" }/>
                    My Membership
                </h2>
                <p>Upgrade your membership to unlock more features.</p>

                <hr/>

                <table style={ { width: "100%", textAlign: "center" } }>
                    <tbody>
                    <tr>
                        <td style={ { width: "25%" } }></td>
                        <td style={ { width: "25%" } }></td>
                        <td style={ { width: "25%" } }></td>
                        <td className={ "caption" } style={ { width: "25%", } }>My Current Plan
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className={ "plan" } style={ { background: "var(--background-color-secondary)" } }>Free</td>
                        <td className={ "plan" }
                            style={ { background: "var(--primary-color)", color: "var(--primary-color-contrast)" } }>
                            Premium
                        </td>
                        <td className={ "plan" }
                            style={ { background: "var(--primary-color)", color: "var(--primary-color-contrast)" } }>
                            Pro
                        </td>
                    </tr>
                    <tr>
                        <td style={ { textAlign: "left" } }>
                            <i className={ "far fa-question" }/>
                            Ask Questions
                        </td>
                        <td><i className={ "fas fa-check" }/></td>
                        <td><i className={ "fas fa-check" }/></td>
                        <td><i className={ "fas fa-check" }/></td>
                    </tr>
                    <tr>
                        <td style={ { textAlign: "left" } }>
                            <i className={ "fas fa-comment-dots" }/>
                            Comment
                        </td>
                        <td><i className={ "fas fa-check" }/></td>
                        <td><i className={ "fas fa-check" }/></td>
                        <td><i className={ "fas fa-check" }/></td>
                    </tr>
                    <tr>
                        <td style={ { textAlign: "left" } }>
                            <i className={ "fas fa-brain" }/>
                            AI Replies
                        </td>
                        <td>up to 3 / m</td>
                        <td><i className={ "fas fa-infinity" }/></td>
                        <td><i className={ "fas fa-infinity" }/></td>
                    </tr>
                    <tr>
                        <td style={ { textAlign: "left" } }>
                            <i className={ "fas fa-wallet" }/>
                            Price
                        </td>
                        <td><p>
                            <span style={ { fontSize: "2em" } }>€0.00</span>
                            <span> / m</span>
                        </p></td>
                        <td><p>
                            <span style={ { fontSize: "2em" } }>€1.99</span>
                            <span> / m</span>
                        </p></td>
                        <td><p>
                            <span style={ { fontSize: "2em" } }>€4.99</span>
                            <span> / m</span>
                        </p></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>;
    }
}
