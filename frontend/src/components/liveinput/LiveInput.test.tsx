import { render } from '@testing-library/react';
import LiveInput from "./LiveInput";

test('testing LiveInput component placeholder', () => {
	render(<LiveInput placeholder={ "h12d7" }/>);
	
	// check if the input is rendered with the placeholder
	const input = document.querySelector('input');
	expect(input).toBeInTheDocument();
	expect(input).toHaveAttribute('placeholder', 'h12d7');
});

test('testing LiveInput component disabled', () => {
	render(<LiveInput disabled={ true }/>);
	
	// check if the input is rendered disabled
	const input = document.querySelector('input');
	expect(input).toBeInTheDocument();
	expect(input).toBeDisabled();
});
