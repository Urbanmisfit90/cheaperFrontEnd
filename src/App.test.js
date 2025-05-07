import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Cheaper heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Cheaper/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders Find the best prices text', () => {
  render(<App />);
  const textElement = screen.getByText(/Find the best prices across websites!/i);
  expect(textElement).toBeInTheDocument();
});

test('renders search bar', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search for products.../i);
  expect(searchInput).toBeInTheDocument();
});

test('renders search button', () => {
  render(<App />);
  const searchButton = screen.getByRole('button', { name: /Search/i });
  expect(searchButton).toBeInTheDocument();
});