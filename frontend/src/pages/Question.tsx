import React from "react";
import "./Question.scss";
import Dropdown from "../components/Dropdown";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { Navigate, useParams } from "react-router-dom";
import SplitSection from "../components/SplitSection";

interface QuestionElemFull {
    id: number;
    title: string;
    content: string;
    tags: string[];
    originalLanguage: string;
    creationDate: string;
    updateDate: string;
    author: Author;
    stats: {
        views: number;
        likes: number;
        dislikes: number;
        answers: number;
        rating: "like" | "dislike" | "none";
    };
    answers: Answer[];
}

interface Author {
    name: string;
    avatar: string;
    plan: string;
}

interface Answer {
    content: string;
    answerDate: string;
    author: Author | "simp";
    stats: {
        likes: number;
        dislikes: number;
        rating: "like" | "dislike" | "none";
    };
}

interface State {
    question?: QuestionElemFull;
    sortBy: "ldr" | "likes" | "dislikes" | "timestamp";
    sortDirection: "asc" | "desc";
    enableAI: boolean;
}

export default function Question() {
    const { id } = useParams();
    let isIdValid = id && !isNaN(Number(id));
    return isIdValid ? <QuestionComp id={ Number(id) }/> : <Navigate to={ "" }/>;
}

class QuestionComp extends React.Component<{ id: number }, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            question: undefined,
            sortBy: "ldr",
            sortDirection: "desc",
            enableAI: true
        };
    }
    
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                question: {
                    id: this.props.id,
                    title: "How to rescue water damaged iPhone 12?",
                    content: "Hi there, I have just dropped my brand new iPhone 12 into the toilet by accident. As expected, the screen turned dark right away and I did not find a way to get any possible sign of life of it. Would any of you happen to know what I could try to rescue the iPhone? ",
                    tags: ["Smartphone", "Technical Support", "iPhone"],
                    originalLanguage: "English",
                    creationDate: "20.10.2023",
                    updateDate: "today",
                    author: {
                        name: "John Doe",
                        avatar: "https://www.w3schools.com/w3images/avatar2.png",
                        plan: "PRO"
                    },
                    stats: {
                        views: 51,
                        likes: 7,
                        dislikes: 3,
                        answers: 2,
                        rating: "like"
                    },
                    answers: [
                        {
                            content: "Back in 2020, the same thing happened to me as well. I tried putting it in an enclosed bag with loads of rice, which actually brought the iPhone 12 back to life after a couple of hours. Try that and you might be an iPhone 12 owner again later. You can tell me how it went.",
                            author: {
                                name: "John Doe",
                                avatar: "https://www.w3schools.com/w3images/avatar2.png",
                                plan: "PRO"
                            },
                            stats: {
                                likes: 7,
                                dislikes: 3,
                                rating: "none"
                            },
                            answerDate: "today"
                        },
                        {
                            content: "I am in the same situation as you. I tried the rice method and it worked for me as well. I hope it works for you too. Good luck!",
                            author: "simp",
                            stats: {
                                likes: 2,
                                dislikes: 0,
                                rating: "dislike"
                            },
                            answerDate: "today"
                        }
                    ]
                }
            });
        }, 1000);
    }
    
    getSortByIcon() {
        switch (this.state.sortBy) {
            case "ldr":
                return "fas fa-scale-balanced";
            case "likes":
                return "far fa-thumbs-up";
            case "dislikes":
                return "far fa-thumbs-down";
            case "timestamp":
                return "fas fa-clock-rotate-left";
        }
    }
    
    render() {
        return <>
            <SplitSection className={ "question-main" }>
                <section className={ "glass" }>
                    { this.state.question ? <p className={ "tags" }>
                        { this.state.question.tags.map((tag, index) =>
                            <span key={ index } className={ "badge" }>{ tag }</span>) }
                    </p> : <Skeleton className={ "tags" }/> }
                    
                    <h2 className={ "question-title" }>{ this.state.question?.title ?? <Skeleton/> }</h2>
                    
                    <p>{ this.state.question?.content ?? <Skeleton count={ 5 }/> }</p>
                    
                    <hr/>
                    
                    { this.state.question ? <span className={ "caption" }>
                        { this.state.question.originalLanguage } (original) · created: { this.state.question.creationDate } · last updated: { this.state.question.updateDate }
                    </span> : <Skeleton/> }
                    
                    { this.state.question && <i className={ "far fa-star add-favorite" } tabIndex={ 0 }/> }
                </section>
                
                <section className={ "glass" }>
                    <div className={ "question-author" } tabIndex={ 0 }>
                        { this.state.question
                            ? <img className={ "avatar" } src={ this.state.question.author.avatar } alt={ "Avatar" }/>
                            : <Skeleton height={ 40 } width={ 40 }/> }
                        
                        <div className={ "question-author-info" }>
                            <span className={ "caption" }>asked by</span>
                            
                            <p>
                                { this.state.question ? <>
                                    <span>{ this.state.question.author.name }</span>
                                    <span className={ "badge" }>{ this.state.question.author.plan }</span>
                                </> : <Skeleton width={ 120 }/> }
                            </p>
                        </div>
                    </div>
                    
                    <hr style={ { marginBlock: "calc(var(--spacing) / 2)" } }/>
                    
                    <span className={ "caption" }>Question Stats</span>
                    <div className={ "question-stats" }>
                        { this.state.question ? <>
                            <div className={ "question-stat" }>
                                <i className={ "fas fa-eye primary-icon" }/>
                                <span
                                    className={ "question-figure" }>{ this.state.question.stats.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                                <span className={ "question-unit" }>views</span>
                            </div>
                            
                            <div
                                className={ "question-stat" + (this.state.question.stats.rating === "like" ? " rating" : "") }>
                                <i className={ "fas fa-thumbs-up primary-icon" } tabIndex={ 0 }/>
                                <span
                                    className={ "question-figure" }>{ this.state.question.stats.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                                <span className={ "question-unit" }>likes</span>
                            </div>
                            
                            <div
                                className={ "question-stat" + (this.state.question.stats.rating === "dislike" ? " rating" : "") }>
                                <i className={ "fas fa-thumbs-down primary-icon" } tabIndex={ 0 }/>
                                <span
                                    className={ "question-figure" }>{ this.state.question.stats.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                                <span className={ "question-unit" }>dislikes</span>
                            </div>
                            
                            <div className={ "question-stat" }>
                                <i className={ "fas fa-comment-dots primary-icon" }/>
                                <span
                                    className={ "question-figure" }>{ this.state.question.stats.answers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</span>
                                <span className={ "question-unit" }>answers</span>
                            </div>
                        </> : <>
                            <Skeleton containerClassName={ "question-stat" } width={ 80 }/>
                            <Skeleton containerClassName={ "question-stat" } width={ 80 }/>
                            <Skeleton containerClassName={ "question-stat" } width={ 80 }/>
                            <Skeleton containerClassName={ "question-stat" } width={ 80 }/>
                        </> }
                    </div>
                    
                    <hr style={ { marginBottom: "calc(var(--spacing) / 2)" } }/>
                    
                    <button className={ "question-report" }>
                        <i className={ "fas fa-flag" }/>
                        Report this question
                    </button>
                </section>
            </SplitSection>
            
            <div className={ "container transparent" } id={ "add-answer" }>
                <div id={ "add-answer-header" }>
                    <h2>
                        <i className={ "far fa-comments" }/>
                        Answers
                    </h2>
                    
                    <Dropdown button={ <p className={ "btn btn-glass" } tabIndex={ 0 }>
                        <i className={ "fas fa-filter" }/>
                        Adjust answers
                    </p> } items={ [
                        {
                            icon: "fas fa-sort",
                            label: "Sort by",
                            items: [
                                {
                                    icon: "fas fa-scale-balanced",
                                    label: "Like-Dislike Ratio",
                                    shortcut: this.state.sortBy === "ldr" ?
                                        <i className={ "fas fa-check" }/> : undefined,
                                    onClick: () => this.setState({ sortBy: "ldr" })
                                },
                                {
                                    icon: "far fa-thumbs-up",
                                    label: "Most likes",
                                    shortcut: this.state.sortBy === "likes" ?
                                        <i className={ "fas fa-check" }/> : undefined,
                                    onClick: () => this.setState({ sortBy: "likes" })
                                },
                                {
                                    icon: "far fa-thumbs-down",
                                    label: "Most dislikes",
                                    shortcut: this.state.sortBy === "dislikes" ?
                                        <i className={ "fas fa-check" }/> : undefined,
                                    onClick: () => this.setState({ sortBy: "dislikes" })
                                },
                                {
                                    icon: "fas fa-clock-rotate-left",
                                    label: "Timestamp",
                                    shortcut: this.state.sortBy === "timestamp" ?
                                        <i className={ "fas fa-check" }/> : undefined,
                                    onClick: () => this.setState({ sortBy: "timestamp" })
                                }
                            ],
                            shortcut: <i className={ this.getSortByIcon() }/>
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
                        },
                        {
                            icon: "fas fa-brain",
                            label: "Enable AI",
                            shortcut: <input type={ "checkbox" }
                                             style={ { userSelect: "none", pointerEvents: "none" } }
                                             checked={ this.state.enableAI } tabIndex={ -1 }/>,
                            onClick: () => this.setState({ enableAI: !this.state.enableAI })
                        }
                    ] }/>
                    
                    <button className={ "btn btn-glass" }
                            style={ { background: "var(--background-color-glass-simp)" } }>
                        <i className={ "fas fa-brain" }/>
                        <span>Ask Simp</span>
                    </button>
                    
                    <button className={ "btn btn-primary" } onClick={ () => {
                        let addAnswerElem = document.getElementById("add-answer");
                        if (!addAnswerElem) return;
                        
                        let isTransparent = !addAnswerElem.classList.contains("transparent");
                        addAnswerElem.classList.toggle("transparent");
                        addAnswerElem.classList.toggle("focus-indicator");
                        
                        let answerEditorElem = document.getElementById("answer-editor");
                        if (!answerEditorElem) return;
                        
                        if (!isTransparent) {
                            answerEditorElem.style.display = "block";
                            answerEditorElem.focus();
                        }
                        
                        answerEditorElem.animate([
                            { height: (isTransparent ? "100px" : "0"), opacity: (isTransparent ? "1" : "0") },
                            { height: (isTransparent ? "0" : "100px"), opacity: (isTransparent ? "0" : "1") }
                        ], {
                            duration: 200,
                            fill: "forwards",
                            easing: "ease-in-out"
                        }).onfinish = () => {
                            if (!answerEditorElem) return;
                            if (isTransparent) answerEditorElem.style.display = "none";
                        };
                    } }>
                        <i className={ "fas fa-plus" }/>
                        <span>Add Answer</span>
                    </button>
                </div>
                
                <hr/>
                
                <p id={ "answer-editor" }
                   contentEditable={ "plaintext-only" }
                   onChange={ (e) => {
                       // only plain text, thanks to Firefox <3
                       setTimeout(() => {
                           // @ts-ignore
                           const text = e.target.innerText;
                           // @ts-ignore
                           e.target.innerText = text;
                       }, 10);
                   } }>
                    New Question
                </p>
            </div>
            
            { this.state.question
                ? this.state.question.answers
                      .filter(answer => this.state.enableAI || answer.author !== "simp")
                      .sort((a, b) => {
                          let res = this.compareAnswers(b, a);
                          return this.state.sortDirection === "desc" ? res : -res;
                      })
                      .map((answer, index) => this.renderAnswer(answer, index))
                : <>
                    { this.renderAnswerSkeleton() }
                    { this.renderAnswerSkeleton() }
                </> }
        </>
    }
    
    private compareAnswers(b: Answer, a: Answer) {
        switch (this.state.sortBy) {
            case "ldr":
                return (b.stats.likes - b.stats.dislikes) - (a.stats.likes - a.stats.dislikes);
            case "likes":
                return b.stats.likes - a.stats.likes;
            case "dislikes":
                return b.stats.dislikes - a.stats.dislikes;
            case "timestamp":
                return Date.parse(b.answerDate) - Date.parse(a.answerDate);
        }
    }
    
    private renderAnswer(answer: Answer, index: number) {
        return <div key={ index } className={ "container transparent question-answer" }>
            <div className={ "question-answer-author" }
                 style={ {
                     paddingTop: answer.author === "simp" ? "var(--spacing)" : 0,
                     paddingInline: answer.author === "simp" ? "var(--spacing)" : 0
                 } }>
                { answer.author === "simp" ? <>
                    <i className={ "fas fa-brain fa-2xl" }
                       style={ {
                           height: "auto",
                           color: "var(--primary-color)",
                           filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))"
                       } }/>
                    
                    <p style={ { paddingTop: "calc(var(--spacing) * 1.5)" } }>
                        <span>Simp</span>
                    </p>
                </> : <div className={ "question-answer-author-user" } tabIndex={ 0 }>
                    <img className={ "avatar" } src={ answer.author.avatar } alt={ "Avatar" }/>
                    
                    <p>
                        <span>{ answer.author.name }</span>
                        <span className={ "badge" }>{ answer.author.plan }</span>
                    </p>
                </div> }
                
                <span className={ "caption" }>replied { answer.answerDate }</span>
            </div>
            
            <div className={ "question-answer-text" }>
                <div className={ "glass" + (answer.author === "simp" ? " glass-simp" : "") }>
                    <p>{ answer.content }</p>
                </div>
                
                <div className={ "question-answer-actions" }>
                    <div
                        className={ "question-answer-actions-rate" + (answer.stats.rating === "like" ? " rating" : "") }>
                        <i className={ "fas fa-thumbs-up primary-icon" } tabIndex={ 0 }/>
                        <span className={ "question-figure" }>{ answer.stats.likes }</span>
                        <span className={ "question-unit" }>likes</span>
                    </div>
                    
                    <div
                        className={ "question-answer-actions-rate" + (answer.stats.rating === "dislike" ? " rating" : "") }>
                        <i className={ "fas fa-thumbs-down primary-icon" } tabIndex={ 0 }/>
                        <span className={ "question-figure" }>{ answer.stats.dislikes }</span>
                        <span className={ "question-unit" }>dislikes</span>
                    </div>
                    
                    <div style={ { flex: 1 } }/>
                    
                    <button className={ "question-report" }>
                        <i className={ "fas fa-flag" }/>
                        Report this answer
                    </button>
                </div>
            </div>
        </div>
    }
    
    private renderAnswerSkeleton() {
        return <div className={ "container transparent question-answer" }>
            <div className={ "question-answer-author" }>
                <Skeleton height={ 40 } width={ 40 }/>
                
                <p>
                    <Skeleton height={ 20 } width={ 100 }/>
                </p>
                
                <span className={ "caption" }><Skeleton width={ 60 }/></span>
            </div>
            
            <div className={ "question-answer-text" }>
                <div className={ "glass" }>
                    <p>
                        <Skeleton count={ 3 }/>
                    </p>
                </div>
                
                <div className={ "question-answer-actions" }>
                    <Skeleton height={ 20 } width={ 100 }/>
                    <Skeleton height={ 20 } width={ 100 }/>
                    
                    <div style={ { flex: 1 } }/>
                    
                    <Skeleton height={ 20 } width={ 200 }/>
                </div>
            </div>
        </div>
    }
}
