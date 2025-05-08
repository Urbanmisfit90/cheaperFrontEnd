import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('shows loading and displays results', async () => {
  render(<App />);
  
  // Trigger the search action
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'iPhone' } });
  fireEvent.click(screen.getByText(/search/i));

  // Wait for the loading message to disappear
  await waitFor(() => expect(screen.queryByText(/Searching for the best prices/i)).not.toBeInTheDocument());

  // Check if results are displayed
  expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
  expect(screen.getAllByTestId('result-item').length).toBeGreaterThan(0);
});

test('shows no results for empty search term', async () => {
  render(<App />);
  
  // Trigger search for "empty" keyword
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'empty' } });
  fireEvent.click(screen.getByText(/search/i));

  // Wait for the loading message to disappear and the no-results element to appear
  await waitFor(() => {
    expect(screen.queryByText(/Searching for the best prices/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
  });
});

test('displays and closes feature notification', async () => {
  render(<App />);

  // Trigger feature notification
  fireEvent.click(screen.getByTestId('trigger-notification'));

  // Check if notification appears
  expect(screen.getByText('Test Feature!')).toBeInTheDocument();

  // Close the notification
  fireEvent.click(screen.getByText('×'));

  // Check if notification disappears
  expect(screen.queryByText('Test Feature!')).not.toBeInTheDocument();
});