import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Customers from './index';

jest.mock('../hooks/useCustomer', () => ({
  useCustomers: () => ({
    customers: [
      {
        id: 1,
        full_name: 'Mahder Belete',
        phone_number: '+254779098071',
        is_loyal: true,
        created_at: '2024-01-01T00:00:00Z',
        address: '123 Main St',
        profile_picture: 'mahder.jpg',
      },
    ],
    totalPages: 1,
    currentPage: 1,
    setPage: jest.fn(),
    loading: false,
    error: null,
  }),
}));

describe('Customers component', () => {
  test('renders title and customer data', () => {
    render(<Customers />);
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    expect(screen.getByText('Mahder Belete')).toBeInTheDocument();
  });

  test('filters customers by search', () => {
    render(<Customers />);
    const searchInput = screen.getByPlaceholderText(/Search by name or phone number/i);

    fireEvent.change(searchInput, { target: { value: 'Mahder' } });
    expect(screen.getByText('Mahder Belete')).toBeInTheDocument();

    
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    expect(screen.queryByText('Mahder Belete')).not.toBeInTheDocument();
  });

  test('opens and closes modal with customer details', async () => {
    render(<Customers />);
    fireEvent.click(screen.getAllByText('View')[0]);

    await waitFor(() => {
      expect(screen.getByText(/Customer Details/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Mahder Belete/).length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText(/Customer Details/i)).not.toBeInTheDocument();
    });
  });
});
