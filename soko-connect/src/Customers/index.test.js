import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Customers from './index';

// Using your provided mock data (trimmed here for brevity; include full dataset as needed)
const mockCustomers = [
  {
    id: 1,
    full_name: 'Mahder Belete',
    phone_number: '+254779098071',
    address: '616,Korongo road',
    profile_picture: 'https://t4.ftcdn.net/jpg/08/16/85/57/360_F_816855785_AOpkHoMIUVAiQai5Nnx7Knn3aH7e6aUl.jpg',
    created_at: '2025-07-24T07:43:09.055311+03:00',
  },
  {
    id: 2,
    full_name: 'Njeri Mwangi',
    phone_number: '+254701234567',
    address: '102, Muthithi Road',
    profile_picture: 'https://randomuser.me/api/portraits/women/54.jpg',
    created_at: '2025-07-01T08:15:00+03:00',
  },
  {
    id: 3,
    full_name: 'Juma Otieno',
    phone_number: '+254712345678',
    address: '45, Ngong Road',
    profile_picture: 'https://randomuser.me/api/portraits/men/54.jpg',
    created_at: '2025-06-20T16:00:00+03:00',
  },
  // Add more customers as needed or use the entire dataset you gave earlier
];

// Mock the useCustomers hook to return your real data without is_loyal/paymentsPerWeek
jest.mock('../hooks/useFetchCustomer', () => ({
  useCustomers: () => ({
    loading: false,
    error: null,
    customers: mockCustomers,
  }),
}));

describe('Customers component', () => {
  test('renders page title and customer data', () => {
    render(<Customers/>);
    expect(screen.getByRole('heading', { name: /customers/i })).toBeInTheDocument();

   
    mockCustomers.forEach(customer => {
      expect(screen.getByText(customer.full_name)).toBeInTheDocument();
      if (customer.address) {
        expect(screen.getByText(customer.address)).toBeInTheDocument();
      }
    });
  });

  test('filters customers by search input', () => {
    render(<Customers />);
    const searchInput = screen.getByPlaceholderText(/search by name or phone number/i);

    fireEvent.change(searchInput, { target: { value: 'Mahder' } });
    expect(screen.getByText('Mahder Belete')).toBeInTheDocument();
    expect(screen.queryByText('Njeri Mwangi')).not.toBeInTheDocument();

  
    fireEvent.change(searchInput, { target: { value: '+2547012' } });
    expect(screen.getByText('Njeri Mwangi')).toBeInTheDocument();
    expect(screen.queryByText('Mahder Belete')).not.toBeInTheDocument();

    
    fireEvent.change(searchInput, { target: { value: 'NoMatch' } });
    expect(screen.queryByText('Mahder Belete')).not.toBeInTheDocument();
    expect(screen.queryByText('Njeri Mwangi')).not.toBeInTheDocument();
    expect(screen.getByText(/no customer data available/i)).toBeInTheDocument();
  });

  test('opens and closes customer detail modal', async () => {
    render(<Customers />);

    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(viewButtons[0]); 
    await waitFor(() => {
      expect(screen.getByText(/customer details/i)).toBeVisible();
    });

    const modal = screen.getByText(/customer details/i).closest('.modal-overlay');
    expect(within(modal).getByText(/Mahder Belete/i)).toBeInTheDocument();
    expect(within(modal).getByText(/616,Korongo road/i)).toBeInTheDocument();

    fireEvent.click(within(modal).getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/customer details/i)).not.toBeInTheDocument();
    });
  });

  test('pagination buttons behave correctly with limited items', () => {
    render(<Customers />);

   
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    const nextBtn = screen.getByRole('button', { name: /next/i });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });
});
