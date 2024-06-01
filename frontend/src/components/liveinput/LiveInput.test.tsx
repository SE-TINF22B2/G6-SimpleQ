/* eslint-disable testing-library/no-node-access */
import { render } from '@testing-library/react';
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

test('testing LiveInput component disabled', () => {
	render(<AlertProvider template={ AlertTemplate }>
		<LiveInput disabled={ true }/>
	</AlertProvider>);
	
	// check if the input is rendered disabled
	const input = document.querySelector('input');
	expect(input).toBeInTheDocument();
	expect(input).toBeDisabled();
});
