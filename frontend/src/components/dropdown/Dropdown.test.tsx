import { act, render, screen } from "@testing-library/react";
import Dropdown from "./Dropdown";

test('testing Dropdown component', async () => {
	const onClick = jest.fn();
	
	render(
		<Dropdown
			button={ <p>8d13g</p> }
			items={ [
				{
					label: "kd12f", icon: "l7wp4", onClick: (closeDropdown) => {
						onClick();
						closeDropdown();
					}
				}
			] }/>
	);
	
	// check if onClick has not been called yet
	expect(onClick).not.toHaveBeenCalled();
	
	// check if dropdown is rendered
	expect(document.querySelector(".dropdown")).toBeInTheDocument();
	
	// check if dropdown button is rendered
	const dropdownButton = screen.getByText("8d13g");
	expect(dropdownButton).toBeInTheDocument();
	
	// check if dropdown is not active
	expect(document.querySelector(".dropdown.active")).not.toBeInTheDocument();
	
	// open dropdown by clicking on the dropdown button and check if it is active
	act(() => dropdownButton.click());
	expect(document.querySelector(".dropdown.active")).toBeInTheDocument();
	
	// check if dropdown item is rendered
	const dropdownItem = screen.getByText("kd12f");
	expect(dropdownItem).toBeInTheDocument();
	expect(dropdownItem).toBeVisible();
	
	// click dropdown item and check if onClick has been called
	act(() => dropdownItem.click());
	expect(onClick).toHaveBeenCalled();
	
	// check if dropdown is not active anymore
	expect(document.querySelector(".dropdown.active")).not.toBeInTheDocument();
});

test('testing Dropdown component submenu', async () => {
	const onClick = jest.fn();
	
	render(
		<Dropdown
			button={ <p>ke12d</p> }
			items={ [
				{
					label: "aj3gd", icon: "paf42", items: [
						{
							label: "sdq23", icon: "l351s", onClick: (closeDropdown) => {
								onClick();
								closeDropdown();
							}
						}
					]
				}
			] }/>
	);
	
	// click on dropdown button to open dropdown menu
	const dropdownButton = screen.getByText("ke12d");
	act(() => dropdownButton.click());
	
	// check if dropdown is active
	expect(document.querySelector(".dropdown.active")).toBeInTheDocument();
	
	// open submenu
	const submenu = screen.getByText("aj3gd");
	act(() => submenu.click());
	
	// check if submenu is rendered
	expect(document.querySelector(".dropdown-menu.left")).toBeInTheDocument();
	
	// check if submenu item is rendered and click it
	const submenuItem = screen.getByText("sdq23");
	act(() => submenuItem.click());
	
	// check if onClick has been called
	expect(onClick).toHaveBeenCalled();
	
	// check if dropdown is not active anymore
	expect(document.querySelector(".dropdown.active")).not.toBeInTheDocument();
});
