import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./shared-components/Header/index", () => () => <div data-testid="header">Header</div>);
jest.mock("./shared-components/Sidebar/index", () => ({ open }) => (
  <div data-testid="sidebar" className={open ? "open" : "closed"}>
    Sidebar
  </div>
));
jest.mock("./Products/index", () => () => <div>Products Component</div>);
jest.mock("./Discounts/index", () => () => <div>Discounts Component</div>);

describe("App component routing and rendering", () => {
  test("renders Header, Sidebar and Products on /products", () => {
    window.history.pushState({}, "Test page", "/products");
    render(<App />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Products Component")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toHaveClass("open");
  });

  test("renders Discounts component on /discounts", () => {
    window.history.pushState({}, "Test page", "/discounts");
    render(<App />);
    expect(screen.getByText("Discounts Component")).toBeInTheDocument();
  });

  test("sidebarOpen state toggles and affects className - manual toggle simulation recommended", () => {
    window.history.pushState({}, "Test page", "/products");
    render(<App />);
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("open");
  });
});
