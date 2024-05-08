import React from "react";
import "./Dropdown.scss";

interface Item {
	label: string,
	icon: string,
	shortcut?: string | JSX.Element,
	onClick?: (closeDropdown: () => void) => void,
	items?: Item[],
	hidden?: boolean,
	divider?: "top" | "bottom" | "both",
	header?: string
}

interface LocalItem extends Item {
	expanded?: boolean
}

export default function Dropdown(props: {
	button: JSX.Element,
	items: Item[],
	direction?: "left" | "right"
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [items, setItems] = React.useState<LocalItem[]>(props.items);
	
	React.useEffect(() => {
		setItems(props.items);
	}, [props.items]);
	
	React.useEffect(() => {
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, [isOpen]);
	
	const onClick = (e: any) => {
		// close dropdown when clicking outside and dropdown is open
		if (isOpen && !e.target.closest(".dropdown") && !e.target.closest(".dropdown-menu")) {
			setIsOpen(false);
		}
	}
	
	const renderItems = (items: LocalItem[], level: number, topDistance?: string): JSX.Element => {
		let classNameAddon = "";
		if (level === 0) classNameAddon = " " + (props.direction ?? "left");
		
		return <ul className={ "dropdown-menu" + classNameAddon } style={ { top: topDistance } }>
			{ items.filter(i => i.hidden !== true).map((item, index) => <>
				{ (item.divider === "top" || item.divider === "both") && <div className={ "divider" }/> }
				
				{ item.header && <div className={ "dropdown-menu-header" }>{ item.header }</div> }
				
				<button key={ index }
						className={ "dropdown-menu-item" }
						onClick={ () => {
							if (item.items && item.items.length > 0) {
								items.forEach((i) => {
									if (i !== item) {
										i.expanded = false;
									}
								});
								item.expanded = !item.expanded;
								
								// Todo: Use items from state??
								// this.setState({ items: this.state.items });
								
								setItems(items);
								return;
							}
							
							if (item.onClick) {
								item.onClick(() => setIsOpen(false));
							}
						} }>
					<i className={ item.icon }/>
					
					<span>{ item.label }</span>
					
					{ item.shortcut && <span className={ "shortcut" }>{ item.shortcut }</span> }
					
					{ (item.items && item.items.length > 0) &&
                        <i className={ "fas fa-angle-down" + (item.expanded ? " expanded" : "") }/> }
				</button>
				
				{ item.expanded && item.items && item.items.length > 0 && renderItems(item.items, level + 1,
					"calc(46px * " + (index + (countPriorDropdownChildrenThatAreNotDropdownItems(items, index) / 2)) + ")"
				) }
				
				{ (item.divider === "bottom" || item.divider === "both") && <div className={ "divider" }/> }
			</>) }
		</ul>;
	}
	
	const countPriorDropdownChildrenThatAreNotDropdownItems = (items: Item[], index: number): number => {
		let shownItems = items.filter(i => i.hidden !== true);
		let count = 0;
		for (let i = 0; i < index; i++) {
			if (shownItems[i].divider !== undefined) count++;
			if (shownItems[i].divider === "both") count++;
			if (shownItems[i].header) count++;
		}
		if (shownItems[index].divider === "top" || shownItems[index].divider === "both") count++;
		if (shownItems[index].header) count++;
		
		return count;
	}
	
	const buttonAction = () => {
		let items2 = items;
		items2.forEach((item) => {
			item.expanded = false;
		});
		setIsOpen(!isOpen);
		setItems(items2);
	}
	
	return <div className={ "dropdown" + (isOpen ? " active" : "") }>
		<div className={ "dropdown-button" }
			 onClick={ () => buttonAction() }
			 onKeyDown={ (e: any) => {
				 if (e.key === "Enter") buttonAction();
			 } }>
			{ props.button }
		</div>
		
		{ isOpen && renderItems(items, 0) }
	</div>;
}
