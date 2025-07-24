import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as fetchAPI from '../../utils/fetchAPI';
import { useVendors } from './index';

// Test component that uses the useVendors hook
const TestComponent = () => {
  const { vendors, loading, error } = useVendors();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {vendors.map((vendor) => (
        <li key={vendor.id}>{vendor.full_name}</li>
      ))}
    </ul>
  );
};

describe('useVendors hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('shows loading initially and then vendors on success', async () => {
    const mockVendors = [
      { id: 1, full_name: 'Angela Moses' },
      { id: 2, full_name: 'Judy Gikuni' },
    ];

    jest.spyOn(fetchAPI, 'fetchData').mockResolvedValueOnce(mockVendors);

    render(<TestComponent />);

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for vendors to render
    await waitFor(() => {
      expect(screen.getByText('Angela Moses')).toBeInTheDocument();
      expect(screen.getByText('Judy Gikuni')).toBeInTheDocument();
    });
  });

  test('shows error message when fetch fails', async () => {
    jest.spyOn(fetchAPI, 'fetchData').mockRejectedValueOnce(new Error('Network error'));

    render(<TestComponent />);

    // Initially loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  test('renders empty list when no vendors are returned', async () => {
    jest.spyOn(fetchAPI, 'fetchData').mockResolvedValueOnce([]);

    render(<TestComponent />);

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for component to render empty list (no items)
    await waitFor(() => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
  });
});
