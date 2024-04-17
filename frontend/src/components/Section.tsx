import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function Section(props: Props) {
    return <section className={ "container" }>
        { props.children }
    </section>
}
