/* eslint-disable testing-library/no-node-access */
import { act, render } from '@testing-library/react';
import LiveInput from "./LiveInput";
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

test('testing LiveInput component placeholder', () => {
	render(<AlertProvider template={ AlertTemplate }>
		<LiveInput placeholder={ "h12d7" }/>
	</AlertProvider>);
	
	// check if the input is rendered with the placeholder
	const input = document.querySelector('input');
	expect(input).toBeInTheDocument();
	expect(input).toHaveAttribute('placeholder', 'h12d7');
});

test('testing LiveInput component disabled with suggestions', () => {
	render(<AlertProvider template={ AlertTemplate }>
		<LiveInput disabled={ true } selectedSuggestions={ ["a"] }/>
	</AlertProvider>);
	
	// check if the input is rendered and focus
	const input = document.querySelector('input');
	expect(input).toBeInTheDocument();
	act(() => input!.click());
	
	// check if divider is not rendered
	const divider = document.querySelector('hr');
	expect(divider).not.toBeInTheDocument();
});

test('testing LiveInput component disabled without suggestions', () => {
	render(<AlertProvider template={ AlertTemplate }>
		<LiveInput disabled={ true } selectedSuggestions={ [] }/>
	</AlertProvider>);
	
	// check if the input is rendered and focus
	const input = document.querySelector('input');
	expect(input).toBeInTheDocument();
	act(() => input!.click());
	
	// check if divider is not rendered
	const divider = document.querySelector('hr');
	expect(divider).not.toBeInTheDocument();
});
