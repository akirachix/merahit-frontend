import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Vendors from './index';

jest.mock('../hooks/useVendor/index', () => ({
  useVendors: () => ({
    vendors: [
      {
        id: 1,
        full_name: 'Angela Moses',
        phone_number: '+254702345678',
        address: '456 Market St',
        usertype: 'Supplier',
        created_at: '2024-02-01T00:00:00Z',
        profile_picture: 'angela.jpg',
      },
      {
        id: 2,
        full_name: 'Judy Gikuni',
        phone_number: '+254790123456',
        address: '789 Broadway',
        usertype: 'Distributor',
        created_at: '2024-03-01T00:00:00Z',
        profile_picture: 'judy.jpg',
      },
    ],
    totalPages: 1,
    currentPage: 1,
    setPage: jest.fn(),
    loading: false,
    error: null,
  }),
}));

describe('Vendors component', () => {
  test('renders title and vendor data', () => {
    render(<Vendors />);
    expect(screen.getByText(/Vendors/i)).toBeInTheDocument();
    expect(screen.getByText('Angela Moses')).toBeInTheDocument();
    expect(screen.getByText('Judy Gikuni')).toBeInTheDocument();
  });

  test('filters vendors by search', () => {
    render(<Vendors />);
    const searchInput = screen.getByPlaceholderText(/Search by name or phone number/i);

    fireEvent.change(searchInput, { target: { value: 'Judy' } });
    expect(screen.queryByText('Angela Moses')).not.toBeInTheDocument();
    expect(screen.getByText('Judy Gikuni')).toBeInTheDocument();
  });

  test('opens and closes modal with vendor details', async () => {
    render(<Vendors />);
    fireEvent.click(screen.getAllByText('View')[0]); 

    await waitFor(() => {
      expect(screen.getByText(/Vendor Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Angela Moses/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText(/Vendor Details/i)).not.toBeInTheDocument();
    });
  });
});
