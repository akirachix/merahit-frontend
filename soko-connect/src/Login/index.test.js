import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './index';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

function renderWithRouter(ui, { route = '/' } = {}) {
  const routes = [{ path: '*', element: ui }];
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  });
  return render(<RouterProvider router={router} />);
}

describe('LoginPage', () => {
  let loginMock;
  let setErrorMessageMock;
  let navigateMock;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
      if (
        typeof msg === 'string' &&
        msg.includes('A component is changing an uncontrolled input to be controlled')
      ) {
        return;
      }
      console.error.mockRestore();
      console.error(msg, ...args);
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  });
  beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      (msg.includes('React Router Future Flag Warning: React Router will begin wrapping state updates') ||
       msg.includes('Relative route resolution within Splat routes is changing'))
    ) {
      return;
    }
    console.warn.mockRestore();
    console.warn(msg, ...args);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
});

afterAll(() => {
  console.warn.mockRestore();
});


  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    loginMock = jest.fn(() => Promise.resolve());
    setErrorMessageMock = jest.fn();
    navigateMock = jest.fn();

    useAuth.mockReturnValue({
      login: loginMock,
      errorMessage: '',
      setErrorMessage: setErrorMessageMock,
    });
    useNavigate.mockReturnValue(navigateMock);
    localStorage.clear();
  });
  

  test('renders phone number and password inputs and login button', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByPlaceholderText(/phone Number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('toggles password visibility when icon clicked', () => {
    renderWithRouter(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('calls login on form submit', () => {
    renderWithRouter(<LoginPage />);
    const phoneInput = screen.getByPlaceholderText(/phone Number/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.change(phoneInput, { target: { value: '123456789' } });
    fireEvent.change(passwordInput, { target: { value: 'mypass' } });
    fireEvent.click(submitButton);

    expect(setErrorMessageMock).toHaveBeenCalledWith('');
    expect(loginMock).toHaveBeenCalledWith('123456789', 'mypass');
  });

  test('displays errorMessage when it exists', () => {
    useAuth.mockReturnValueOnce({
      login: jest.fn(),
      errorMessage: 'Invalid credentials',
      setErrorMessage: jest.fn(),
    });
    renderWithRouter(<LoginPage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  test('redirects to /dashboard if access_token exists in localStorage', () => {
    localStorage.setItem('access_token', 'dummy-token');
    renderWithRouter(<LoginPage />);
    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });
});
