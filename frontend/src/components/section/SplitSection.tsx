import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function SplitSection(props: Props) {
    return <div className={ "container transparent" + (props.className ? " " + props.className : "") }>
        { props.children }
    </div>
}
