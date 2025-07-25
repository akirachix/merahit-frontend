import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './index';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardSummary } from './hooks/useDashboardSummary';

jest.mock('../../hooks/useAuth');
jest.mock('./hooks/useDashboardSummary');

describe('Home Page', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { id: 1, name: 'Test User', role: 'admin' } });
    useDashboardSummary.mockReturnValue({
      summary: {
        totalOrders: 10,
        totalCustomers: 15,
        totalVendors: 5,
        totalProducts: 30,
        totalOrderItems: 50,
        totalPayments: 8,
        totalCarts: 12,
        totalDiscounts: 4,
        totalReviews: 20,
        ordersByStatus: { pending: 5, completed: 5 },
        totalOrderAmount: 5000,
        productsByCategory: { electronics: 10, clothing: 20 },
        averageRating: 4.5,
        activeDiscounts: 2,
      },
      loading: false,
      error: null,
    });
  });

  it('renders without crashing', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Entity Totals/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Categories/i)).toBeInTheDocument();
    expect(screen.getByText(/Financial & Rating Overview/i)).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    useDashboardSummary.mockReturnValue({ summary: {}, loading: true, error: null });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('shows error state', async () => {
    useDashboardSummary.mockReturnValue({ summary: {}, loading: false, error: 'Failed to fetch' });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  it('does not render dashboard for unauthenticated user', async () => {
    useAuth.mockReturnValue({ user: null });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Please log in to view the dashboard/i)).toBeInTheDocument();
  });
});