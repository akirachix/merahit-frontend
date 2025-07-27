import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardIndex from './index';
import { useDashboardSummary } from '../hooks/useDashboardSummary';


jest.mock('../hooks/useDashboardSummary');


jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Mocked Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Mocked Pie Chart</div>,
  Line: () => <div data-testid="line-chart">Mocked Line Chart</div>,
}));

const mockSummaryData = {
  totalOrders: 100,
  totalCustomers: 50,
  totalVendors: 20,
  totalProducts: 200,
  totalOrderAmount: 50000,
  averageRating: 4.5,
  activeDiscounts: 10,
  productsByCategory: {
    Electronics: 50,
    Clothing: 75,
    Books: 25,
  },
  salesByDate: {
    '2025-07-01': 1000,
    '2025-07-02': 1500,
    '2025-07-03': 2000,
  },
};

describe('DashboardIndex Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        getPropertyValue: jest.fn().mockReturnValue('rgba(76, 175, 80, 0.6)'),
      }),
    });
  });

  test('renders loading state', () => {
    useDashboardSummary.mockReturnValue({
      summary: null,
      loading: true,
      error: null,
    });

    render(<DashboardIndex />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error state', () => {
    useDashboardSummary.mockReturnValue({
      summary: null,
      loading: false,
      error: 'Failed to fetch data',
    });

    render(<DashboardIndex />);
    expect(screen.getByText(/error: failed to fetch data/i)).toBeInTheDocument();
  });

  test('renders no data message when summary is empty', () => {
    useDashboardSummary.mockReturnValue({
      summary: {},
      loading: false,
      error: null,
    });

    render(<DashboardIndex />);
    expect(screen.getByText(/no summary data available/i)).toBeInTheDocument();
  });

  test('renders dashboard with summary data', () => {
    useDashboardSummary.mockReturnValue({
      summary: mockSummaryData,
      loading: false,
      error: null,
    });

    render(<DashboardIndex />);

    expect(screen.getByText(/overview of platform metrics and analytics/i)).toBeInTheDocument();

    expect(screen.getByText(/platform overview - all time/i)).toBeInTheDocument();

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText(/total orders/i)).toBeInTheDocument();

    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText(/total customers/i)).toBeInTheDocument();

    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText(/total vendors/i)).toBeInTheDocument();

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText(/total products/i)).toBeInTheDocument();

    expect(screen.getByText(/kes 50000/i)).toBeInTheDocument();
    expect(screen.getByText(/total sales/i)).toBeInTheDocument();

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText(/avg rating/i)).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/active discounts/i)).toBeInTheDocument();

    expect(screen.getByText(/products by category/i)).toBeInTheDocument();
    expect(screen.getByText(/key metrics/i)).toBeInTheDocument();

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('changes time filter and updates header', async () => {
    useDashboardSummary.mockReturnValue({
      summary: mockSummaryData,
      loading: false,
      error: null,
    });

    render(<DashboardIndex />);

    expect(screen.getByText(/platform overview - all time/i)).toBeInTheDocument();

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '30d' } });

    await waitFor(() =>
      expect(screen.getByText(/platform overview - last 30 days/i)).toBeInTheDocument()
    );
  });
});
