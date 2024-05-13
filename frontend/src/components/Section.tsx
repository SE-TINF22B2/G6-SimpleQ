import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Section(props: Props) {
    return <section className={ "container" + (props.className ? " " + props.className : "") }>
        { props.children }
    </section>
}
