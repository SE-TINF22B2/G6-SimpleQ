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

/**
 * Renders a dropdown menu
 * @param props.button JSX Element that should be displayed and will open the dropdown menu on click
 * @param props.items List of items that should be displayed in the dropdown menu, recursion possible
 * @param props.direction direction the dropdown menus align, default is "left"
 */
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
		// close dropdown when clicking outside and dropdown is open
		const onClick = (e: any) => {
			if (isOpen && !e.target.closest(".dropdown") && !e.target.closest(".dropdown-menu"))
				setIsOpen(false);
		}
		
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, [isOpen]);
	
	const renderItems = (localItems: LocalItem[], level: number, topDistance?: string): JSX.Element => {
		let classNameAddon = "";
		if (level === 0) classNameAddon = " " + (props.direction ?? "left");
		
		return <ul className={ "dropdown-menu" + classNameAddon }
				   style={ {
					   top: topDistance,
					   transform: level === 0 ? "" : "translateX(calc(var(--spacing) * " + (props.direction === "right" ? "" : "-") + "0.5))"
				   } }>
			{ localItems.filter(i => i.hidden !== true).map((item, index) => <li key={ index }>
				{ (item.divider === "top" || item.divider === "both") && <div className={ "divider" }/> }
				
				{ item.header && <div className={ "dropdown-menu-header" }>{ item.header }</div> }
				
				<button className={ "dropdown-menu-item" }
						onClick={ () => {
							setItems(items.map(i => {
								return {
									...i,
									...{ expanded: i === item ? !i.expanded : false }
								}
							}))
							
							if (item.onClick)
								item.onClick(() => setIsOpen(false));
						} }>
					<i className={ item.icon }/>
					
					<span>{ item.label }</span>
					
					{ item.shortcut && <span className={ "shortcut" }>{ item.shortcut }</span> }
					
					{ (item.items && item.items.length > 0) &&
                        <i className={ "fi fi-rr-angle-down" + (item.expanded ? " expanded" : "") }/> }
				</button>
				
				{ item.expanded && item.items && item.items.length > 0 && renderItems(item.items, level + 1,
					"calc(46px * " + (index + (countPriorDropdownChildrenThatAreNotDropdownItems(localItems, index) / 2)) + ")"
				) }
				
				{ (item.divider === "bottom" || item.divider === "both") && <div className={ "divider" }/> }
			</li>) }
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
	
	return <div className={ "dropdown" + (isOpen ? " active" : "") }
				onBlur={ (e: any) => {
					let isFocusWithin = e.currentTarget.contains(e.relatedTarget);
					if (!isFocusWithin) setIsOpen(false);
				} }>
		<div className={ "dropdown-button" }
			 onClick={ buttonAction }
			 onKeyDown={ (e: any) => {
				 if (e.key === "Enter") buttonAction();
			 } }>
			{ props.button }
		</div>
		
		{ isOpen && renderItems(items, 0) }
	</div>;
}
