import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  // Mock process.env for testing
  jest.resetModules();
  process.env = { ...process.env, NODE_ENV: 'test' };
});

test('shows loading and displays results', async () => {
  render(<App />);
  
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'iPhone' } });
  fireEvent.click(screen.getByText(/search/i));

  await waitFor(() => expect(screen.queryByText(/Searching for the best prices/i)).not.toBeInTheDocument());

  expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
  expect(screen.getAllByTestId('result-item').length).toBeGreaterThan(0);
});

test('shows "No results found" for empty search', async () => {
  render(<App />);
  
  // Submit empty search
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: '   ' } }); // Whitespace
  fireEvent.click(screen.getByText(/search/i));

  await waitFor(() => {
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});

test('displays and closes feature notification', async () => {
  render(<App />);
  
  fireEvent.click(screen.getByTestId('trigger-notification'));
  expect(screen.getByText('Test Feature!')).toBeInTheDocument();
  
  fireEvent.click(screen.getByTestId('close-notification'));
  expect(screen.queryByText('Test Feature!')).not.toBeInTheDocument();
});

test('displays sticky banners', () => {
  render(<App />);
  expect(screen.getByText(/Free shipping on all orders/i)).toBeInTheDocument();
  expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
});

test('can dismiss cookie banner', () => {
  render(<App />);
  fireEvent.click(screen.getByText('×'));
  expect(screen.queryByTestId('cookie-banner')).not.toBeInTheDocument();
});