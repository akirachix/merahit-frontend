import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './index';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('@mui/icons-material/BarChart', () => () => <span data-testid="BarChartIcon" />);
jest.mock('@mui/icons-material/Person', () => () => <span data-testid="PersonIcon" />);
jest.mock('@mui/icons-material/Business', () => () => <span data-testid="BusinessIcon" />);
jest.mock('@mui/icons-material/Inventory', () => () => <span data-testid="InventoryIcon" />);
jest.mock('@mui/icons-material/Receipt', () => () => <span data-testid="ReceiptIcon" />);
jest.mock('@mui/icons-material/Star', () => () => <span data-testid="StarIcon" />);
jest.mock('@mui/icons-material/LocalOffer', () => () => <span data-testid="LocalOfferIcon" />);

describe('Sidebar Component', () => {
  const mockSetSidebarOpen = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders sidebar with logo and navigation items', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.getByAltText('Soko Connect Logo')).toBeInTheDocument();
    ['Dashboard', 'Customers', 'Vendors', 'Products', 'Orders', 'Reviews', 'Discounts'].forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    expect(screen.getByTestId('BarChartIcon')).toBeInTheDocument();
  });

  test('applies correct classes based on open state', () => {
    const { rerender } = render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.getByRole('navigation')).toHaveClass('sidebar', 'open');
    rerender(<Sidebar open={false} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.getByRole('navigation')).toHaveClass('sidebar', 'closed');
  });

  test('navigates to correct route when a navigation item is clicked', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    fireEvent.click(screen.getByText('Customers'));
    expect(mockNavigate).toHaveBeenCalledWith('/customers');
  });

  test('applies active class to current navigation item', () => {
    delete window.location;
    window.location = { pathname: '/customers' };
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.getByText('Customers').parentElement).toHaveClass('active');
    expect(screen.getByText('Dashboard').parentElement).not.toHaveClass('active');
  });
  
  test('forwards ref to nav element', () => {
    const ref = React.createRef();
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('navigation'));
  });
});