import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./index"; 

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: (props) => <span data-testid="fa-icon" {...props} />,
}));

jest.mock("@mui/material", () => ({
  Dialog: ({ children, open }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogActions: ({ children }) => <div>{children}</div>,
  Button: ({ children, onClick, color }) => (
    <button onClick={onClick} style={{ color: color || "black" }} data-testid={`button-${children.toLowerCase()}`}>
      {children}
    </button>
  ),
  TextField: ({ label, type, value, onChange, required }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={label}
      required={required}
      data-testid={`input-${label.toLowerCase()}`}
    />
  ),
  Typography: ({ children, variant, sx, onClick }) => (
    <div style={sx} onClick={onClick} data-testid="typography">
      {children}
    </div>
  ),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test("renders login form with email and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  test("shows password when eye icon is clicked", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const toggle = screen.getByLabelText(/Show password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggle);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("navigates to dashboard on form submission", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});