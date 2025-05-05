import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './components/SearchBar';

test('renders search input', () => {
  render(<SearchBar onSearch={() => {}} />);
  const inputElement = screen.getByPlaceholderText(/Search for products.../i);
  expect(inputElement).toBeInTheDocument();
});

test('renders search button', () => {
  render(<SearchBar onSearch={() => {}} />);
  const buttonElement = screen.getByRole('button', { name: /Search/i });
  expect(buttonElement).toBeInTheDocument();
});

test('calls onSearch when form is submitted', () => {
  const mockOnSearch = jest.fn();
  render(<SearchBar onSearch={mockOnSearch} />);
  
  const inputElement = screen.getByPlaceholderText(/Search for products.../i);
  const searchTerm = 'smartphone';
  
  // Type in the search box
  fireEvent.change(inputElement, { target: { value: searchTerm } });
  expect(inputElement.value).toBe(searchTerm);
  
  // Submit the form
  const formElement = screen.getByRole('button', { name: /Search/i }).closest('form');
  fireEvent.submit(formElement);
  
  // Check if onSearch was called with the correct search term
  expect(mockOnSearch).toHaveBeenCalledTimes(1);
  expect(mockOnSearch).toHaveBeenCalledWith(searchTerm);
});

test('does not call onSearch when form is submitted with empty input', () => {
  const mockOnSearch = jest.fn();
  render(<SearchBar onSearch={mockOnSearch} />);
  
  // Submit the form with empty input
  const formElement = screen.getByRole('button', { name: /Search/i }).closest('form');
  fireEvent.submit(formElement);
  
  // Check that onSearch was not called
  expect(mockOnSearch).not.toHaveBeenCalled();
});