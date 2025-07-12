import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './index'; 
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@mui/icons-material/BarChart', () => () => <i data-testid="icon-bar-chart" />);
jest.mock('@mui/icons-material/Person', () => () => <i data-testid="icon-person" />);
jest.mock('@mui/icons-material/Business', () => () => <i data-testid="icon-business" />);
jest.mock('@mui/icons-material/Inventory', () => () => <i data-testid="icon-inventory" />);
jest.mock('@mui/icons-material/Receipt', () => () => <i data-testid="icon-receipt" />);
jest.mock('@mui/icons-material/Star', () => () => <i data-testid="icon-star" />);
jest.mock('@mui/icons-material/LocalOffer', () => () => <i data-testid="icon-local-offer" />);
jest.mock('@mui/icons-material/Close', () => ({ className, onClick }) => (
  <i data-testid="icon-close" className={className} onClick={onClick} />
));

describe('Sidebar Component', () => {
  let mockSetSidebarOpen;
  let mockNavigate;

  beforeEach(() => {
    mockSetSidebarOpen = jest.fn();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    Object.defineProperty(window, 'location', {
      value: { pathname: '/dashboard/dashboard' },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Sidebar with open state and displays navigation items', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByTestId('icon-close')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveClass('sidebar open');
  });

  test('renders Sidebar with closed state and hides navigation items', () => {
    render(<Sidebar open={false} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveClass('sidebar closed');
  });

  test('applies active class to the current route', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    const dashboardItem = screen.getByText('Dashboard').parentElement;
    expect(dashboardItem).toHaveClass('active');
  });

  test('navigates to the correct path when a navigation item is clicked', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    const customersItem = screen.getByText('Customers').parentElement;
    fireEvent.click(customersItem);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/customers');
  });

  test('calls setSidebarOpen with false when close icon is clicked', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    const closeIcon = screen.getByTestId('icon-close');
    fireEvent.click(closeIcon);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });

  test('does not close sidebar when clicking inside', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    fireEvent.mouseDown(screen.getByRole('navigation'));
    expect(mockSetSidebarOpen).not.toHaveBeenCalled();
  });

  test('does not close sidebar when clicking the hamburger button', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    const hamburgerButton = document.createElement('button');
    hamburgerButton.className = 'header-hamburger';
    document.body.appendChild(hamburgerButton);
    fireEvent.mouseDown(hamburgerButton);
    expect(mockSetSidebarOpen).not.toHaveBeenCalled();
    document.body.removeChild(hamburgerButton);
  });

  test('renders correct icons for each navigation item', () => {
    render(<Sidebar open={true} setSidebarOpen={mockSetSidebarOpen} />);
    expect(screen.getByTestId('icon-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('icon-person')).toBeInTheDocument();
  });
});