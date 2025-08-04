import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as fetchAPI from '../../utils/fetchAPI';
import { useCustomers } from './index';

// Test component to use the hook and display results
const TestComponent = () => {
  const { customers, loading, error } = useCustomers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {customers.map((customer) => (
        <li key={customer.id}>{customer.full_name}</li>
      ))}
    </ul>
  );
};

describe('useCustomers hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('initially shows loading, then renders customer data', async () => {
    const mockCustomers = [
      { id: 1, full_name: 'John Doe' },
      { id: 2, full_name: 'Jane Smith' },
    ];
    jest.spyOn(fetchAPI, 'fetchData').mockResolvedValueOnce(mockCustomers);

    render(<TestComponent />);

    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for customers to be rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('shows error message if fetch fails', async () => {
    jest.spyOn(fetchAPI, 'fetchData').mockRejectedValueOnce(new Error('Network error'));

    render(<TestComponent />);

    // Loading shown initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  test('renders empty list if no customers returned', async () => {
    jest.spyOn(fetchAPI, 'fetchData').mockResolvedValueOnce([]);

    render(<TestComponent />);

    // Loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for empty list to render (no customer list items)
    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
});
