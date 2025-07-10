import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './index'; 

describe('Footer Component', () => {
  test('renders Footer component', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('displays correct copyright text', () => {
    render(<Footer />);
    const footerText = screen.getByText(/© \d{4} Soko Connect \| Admin Dashboard/);
    expect(footerText).toBeInTheDocument();
  });

  test('displays current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(`© ${currentYear} Soko Connect | Admin Dashboard`)).toBeInTheDocument();
  });

  test('has correct className', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('admin-footer');
  });
});