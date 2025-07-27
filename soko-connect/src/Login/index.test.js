import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './index';


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));


jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

describe('LoginPage Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test('renders login form with username and password inputs', () => {
    render(<LoginPage />);

    expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  test('navigates to dashboard on form submission', () => {
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log In/i });

    fireEvent.change(usernameInput, { target: { value: 'anyuser' } });
    fireEvent.change(passwordInput, { target: { value: 'anypass' } });
    fireEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('toggles password visibility', () => {
    render(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const toggleButton = screen.getByRole('button', { name: /Show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});