import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Header from './index';


jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: jest.fn(({ icon, ...props }) => <span {...props} />),
}));

describe('Header Component', () => {
  const mockSetSidebarOpen = jest.fn();

  test('renders header with title and hamburger button', () => {
    render(<Header sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);

    expect(screen.getByText('Soko Connect Admin Dashboard')).toBeInTheDocument();
    const hamburgerButton = screen.getByRole('button', { name: /close sidebar/i });
    expect(hamburgerButton).toBeInTheDocument();
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('toggles sidebar open state when hamburger button is clicked', () => {
    render(<Header sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);

    const hamburgerButton = screen.getByRole('button', { name: /close sidebar/i });
    fireEvent.click(hamburgerButton);

    expect(mockSetSidebarOpen).toHaveBeenCalledWith(expect.any(Function));
    const toggleFunction = mockSetSidebarOpen.mock.calls[0][0];
    expect(toggleFunction(true)).toBe(false);
  });

  test('displays correct aria-label when sidebar is closed', () => {
    render(<Header sidebarOpen={false} setSidebarOpen={mockSetSidebarOpen} />);

    const hamburgerButton = screen.getByRole('button', { name: /open sidebar/i });
    expect(hamburgerButton).toBeInTheDocument();
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('has correct classes applied', () => {
    render(<Header sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('admin-header');

    const headerContent = screen.getByText('Soko Connect Admin Dashboard').parentElement;
    expect(headerContent).toHaveClass('header-content');

    const headerTitle = screen.getByText('Soko Connect Admin Dashboard');
    expect(headerTitle).toHaveClass('header-title');
  });
});