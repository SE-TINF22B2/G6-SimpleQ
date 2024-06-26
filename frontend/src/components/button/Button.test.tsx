import { act, render, screen } from "@testing-library/react";
import React from "react";
import Button from "./Button";
import { vi } from "vitest";

test('testing Button component', () => {
	const onClick = vi.fn();
	
	render(<Button iconLeft={ "f2a94" } onClick={ onClick }>51b8r</Button>);
	const button = screen.getByText("51b8r");
	
	// check if button is rendered
	expect(button).toBeInTheDocument();
	
	// check if button has the correct icon
	const { parentNode } = button;
	const { firstChild } = parentNode!;
	expect(firstChild).toHaveClass("f2a94");
	
	// check if onClick will be called
	act(() => button.click());
	expect(onClick).toBeCalled();
});
