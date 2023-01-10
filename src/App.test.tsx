import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('displays title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Sauerteig/i);
  expect(linkElement).toBeInTheDocument();
});
