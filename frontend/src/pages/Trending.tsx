import React from "react";
import "./Trending.scss";
import Dropdown from "../components/Dropdown";
import Skeleton from "react-loading-skeleton";
import { NavigateFunction } from "react-router-dom";
import thinking from "../illustrations/thinking.svg";

interface State {
    questions?: QuestionElem[];
    sortBy: "timestamp";
    sortDirection: "asc" | "desc";
}

interface QuestionElem {
    id: number;
    title: string;
    originalLanguage: string;
    creationDate: string;
    updateDate: string;
    tags: string[];
    stats: {
        likes: number;
        dislikes: number;
        views: number;
        answers: number;
        rating: "like" | "dislike" | "none";
    }
    author: {
        name: string;
        avatar: string;
    };
}

export default class Trending extends React.Component<{ navigate: NavigateFunction }, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            sortBy: "timestamp",
            sortDirection: "desc"
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({
            questions: [
                {
                    id: 1,
                    title: "How to rescue water damaged iPhone 12?",
                    originalLanguage: "English",
                    creationDate: "20.10.2023",
                    updateDate: "today",
                    tags: ["Smartphone", "Technical Support", "iPhone"],
                    stats: {
                        views: 51,
                        likes: 7,
                        dislikes: 3,
                        answers: 2,
                        rating: "like"
                    },
                    author: {
                        name: "John Doe",
                        avatar: "https://www.w3schools.com/w3images/avatar2.png"
                    }
                },
                {
                    id: 2,
                    title: "What is the best way to learn React?",
                    originalLanguage: "ENGLISH",
                    creationDate: "20.10.2023",
                    updateDate: "TODAY",
                    tags: ["Tag 1", "Tag 2", "Tag 3"],
                    stats: {
                        likes: 123,
                        dislikes: 5122,
                        views: 13412,
                        answers: 202,
                        rating: "none"
                    },
                    author: {
                        name: "John Doe",
                        avatar: "https://www.w3schools.com/w3images/avatar2.png"
                    }
                }
            ]
        }), 1000);
    }

    render() {
        return <>
            <div className={ "container" }>
                <div style={ { display: "flex" } }>
                    <div style={ { flex: 1 } }>
                        <h1>
                            <i className={ "fas fa-chart-line" }/>
                            Trending
                        </h1>
                        <p>See what's trending on our platform.</p>

                        <Dropdown button={ <p className={ "btn btn-glass" } tabIndex={ 0 }>
                            <i className={ "fas fa-filter" }/>
                            Adjust questions
                        </p> } items={ [
                            {
                                icon: "fas fa-sort",
                                label: "Sort by",
                                items: [
                                    {
                                        icon: "fas fa-clock-rotate-left",
                                        label: "Timestamp",
                                        shortcut: this.state.sortBy === "timestamp" ?
                                            <i className={ "fas fa-check" }/> : undefined,
                                        onClick: () => this.setState({ sortBy: "timestamp" })
                                    }
                                ],
                                shortcut: <i className={ "fas fa-clock-rotate-left" }/>
                            },
                            {
                                icon: "fas fa-sort-amount-down",
                                label: "Direction",
                                items: [
                                    {
                                        icon: "fas fa-arrow-trend-up",
                                        label: "Ascending",
                                        shortcut: this.state.sortDirection === "asc" ?
                                            <i className={ "fas fa-check" }/> : undefined,
                                        onClick: () => this.setState({ sortDirection: "asc" })
                                    },
                                    {
                                        icon: "fas fa-arrow-trend-down",
                                        label: "Descending",
                                        shortcut: this.state.sortDirection === "desc" ?
                                            <i className={ "fas fa-check" }/> : undefined,
                                        onClick: () => this.setState({ sortDirection: "desc" })
                                    }
                                ],
                                shortcut: <i
                                    className={ "fas fa-arrow-trend-" + (this.state.sortDirection === "asc" ? "up" : "down") }/>
                            }
                        ] } direction={ "right" }/>
                    </div>

                    <img src={ thinking } alt={ "Trending" } style={ { height: "120px", alignSelf: "center" } }/>
                </div>
            </div>

            { this.state.questions ? this.state.questions.map((question, index) =>
                this.renderQuestion(question, index)) : <>
                { this.renderQuestionSkeleton() }
                { this.renderQuestionSkeleton() }
                { this.renderQuestionSkeleton() }
            </> }
        </>;
    }

    private renderQuestion(question: QuestionElem, index: number) {
        return <div key={ index }
                    className={ "container questions-question focus-indicator" }
                    tabIndex={ 0 }
                    style={ { order: index } }
                    onClick={ () => {
                        this.props.navigate("/question/" + question.id);
                    } }
                    onKeyDown={ (e: any) => {
                        if (e.key === "Enter") this.props.navigate("/question/" + question.id);
                    } }>
            <div className={ "question-wrapper" }>
                <h2>
                    <i className={ "far fa-question" }/>
                </h2>

                <div className={ "question" }>
                    <p className={ "tags" }>
                        { question.tags.map((tag, index) =>
                            <span key={ index } className={ "badge" }>{ tag }</span>) }
                    </p>

                    <h2>{ question.title }</h2>

                    <span
                        className={ "caption" }>{ question.originalLanguage } (Original) · Created: { question.creationDate } · Last Updated: { question.updateDate }</span>
                </div>
            </div>

            <div className={ "question-stats" }>
                <div
                    className={ "question-stat" + (question.stats.rating === "like" ? " rating" : "") }>
                    <i className={ "fas fa-thumbs-up primary-icon" }/>
                    <span
                        className={ "question-figure" }>{ question.stats.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                    <span className={ "question-unit" }>likes</span>
                </div>

                <div
                    className={ "question-stat" + (question.stats.rating === "dislike" ? " rating" : "") }>
                    <i className={ "fas fa-thumbs-down primary-icon" }/>
                    <span
                        className={ "question-figure" }>{ question.stats.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                    <span className={ "question-unit" }>dislikes</span>
                </div>
            </div>

            <div className={ "question-stats" }>
                <div className={ "question-stat" }>
                    <i className={ "fas fa-eye primary-icon" }/>
                    <span
                        className={ "question-figure" }>{ question.stats.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                    <span className={ "question-unit" }>views</span>
                </div>

                <div className={ "question-stat" }>
                    <i className={ "fas fa-comment-dots primary-icon" }/>
                    <span
                        className={ "question-figure" }>{ question.stats.answers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                    <span className={ "question-unit" }>answers</span>
                </div>
            </div>

            <div className={ "author" }>
                <img className={ "avatar" } src={ question.author.avatar }
                     alt={ "Avatar" }/>
                <p style={ { margin: 0, display: "flex", flexDirection: "column" } }>
                    <span className={ "caption" }>Asked by</span>
                    <span>{ question.author.name }</span>
                </p>
            </div>
        </div>
    }

    private renderQuestionSkeleton() {
        return <div className={ "container questions-question" } style={ { cursor: "auto" } }>
            <div className={ "question-wrapper" }>
                <h2>
                    <Skeleton width={ 40 } style={ { marginRight: "var(--spacing)" } }/>
                </h2>

                <div className={ "question" }>
                    <Skeleton containerClassName={ "tags" }/>

                    <h2>
                        <Skeleton/>
                    </h2>

                    <Skeleton containerClassName={ "caption" } width={ 400 }/>
                </div>
            </div>

            <div className={ "question-stats" }>
                <div className={ "question-stat" }>
                    <Skeleton width={ 100 } height={ 24 }/>
                </div>

                <div className={ "question-stat" }>
                    <Skeleton width={ 100 } height={ 24 }/>
                </div>
            </div>

            <div className={ "question-stats" }>
                <div className={ "question-stat" }>
                    <Skeleton width={ 100 } height={ 24 }/>
                </div>

                <div className={ "question-stat" }>
                    <Skeleton width={ 100 } height={ 24 }/>
                </div>
            </div>

            <div className={ "author" }>
                <Skeleton circle width={ 40 } height={ 40 }/>

                <p style={ { margin: 0, display: "flex", flexDirection: "column" } }>
                    <Skeleton width={ 100 } height={ 12 }/>
                    <Skeleton width={ 100 } height={ 20 }/>
                </p>
            </div>
        </div>
    }
}
