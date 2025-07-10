import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './index';


jest.mock('@mui/icons-material/BarChart', () => () => <div data-testid="BarChartIcon" />);
jest.mock('@mui/icons-material/Person', () => () => <div data-testid="PersonIcon" />);
jest.mock('@mui/icons-material/Business', () => () => <div data-testid="BusinessIcon" />);
jest.mock('@mui/icons-material/Inventory', () => () => <div data-testid="InventoryIcon" />);
jest.mock('@mui/icons-material/Receipt', () => () => <div data-testid="ReceiptIcon" />);
jest.mock('@mui/icons-material/Star', () => () => <div data-testid="StarIcon" />);
jest.mock('@mui/icons-material/LocalOffer', () => () => <div data-testid="LocalOfferIcon" />);

describe('Sidebar component', () => {
  const onNavMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders as closed by default', () => {
    render(<Sidebar open={false} active="" onNav={onNavMock} />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveClass('closed');
  });

  test('renders all navigation items when open', () => {
    render(<Sidebar open={true} active="" onNav={onNavMock} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Vendors')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('Discounts')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveClass('open');
  });

  test('calls onNav with correct route when an item is clicked', () => {
    render(<Sidebar open={true} active="" onNav={onNavMock} />);
    fireEvent.click(screen.getByText('Vendors'));
    expect(onNavMock).toHaveBeenCalledWith('/dashboard/vendors');
  });

  test('applies the active class to the active nav item', () => {
    render(<Sidebar open={true} active="products" onNav={onNavMock} />);
    const activeItem = screen.getByText("Products").closest('li');
    expect(activeItem).toHaveClass('active');
  });

  test('renders all icons', () => {
    render(<Sidebar open={true} active="" onNav={onNavMock} />);
    expect(screen.getByTestId('BarChartIcon')).toBeInTheDocument();
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    expect(screen.getByTestId('BusinessIcon')).toBeInTheDocument();
    expect(screen.getByTestId('InventoryIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ReceiptIcon')).toBeInTheDocument();
    expect(screen.getByTestId('StarIcon')).toBeInTheDocument();
    expect(screen.getByTestId('LocalOfferIcon')).toBeInTheDocument();
  });
});


