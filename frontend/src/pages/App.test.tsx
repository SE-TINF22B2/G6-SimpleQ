import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('testing App', () => {
	render(<App/>);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).not.toBeInTheDocument();
});
