





import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";


jest.mock("./shared-components/Header/index", () => () => <div data-testid="header">Header</div>);
<<<<<<< HEAD
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
=======
jest.mock("./shared-components/Sidebar/index", () => (props) => (
 <div data-testid="sidebar">{props.open ? "Sidebar Open" : "Sidebar Closed"}</div>
));
jest.mock("./Dashboard", () => () => <div data-testid="dashboard">Dashboard Content</div>);
jest.mock("./Login", () => () => <div data-testid="login-page">Login Page</div>);


describe("App routing", () => {
 beforeEach(() => {
   jest.resetModules();
  
   window.localStorage.clear();
 });


 test("redirects from / to /login", () => {
   window.history.pushState({}, "Test page", "/");


   render(<App />);


   expect(screen.getByTestId("login-page")).toBeInTheDocument();
 });


 test("shows login page at /login", () => {
   window.history.pushState({}, "Test page", "/login");


   render(<App />);


   expect(screen.getByTestId("login-page")).toBeInTheDocument();
 });


 test("shows dashboard layout and content at /dashboard", () => {
   window.localStorage.setItem('access_token', 'mock-token');


   window.history.pushState({}, "Test page", "/dashboard");


   render(<App />);


   expect(screen.getByTestId("header")).toBeInTheDocument();
   expect(screen.getByTestId("sidebar")).toBeInTheDocument();
   expect(screen.getByTestId("dashboard")).toBeInTheDocument();


   expect(screen.getByTestId("sidebar")).toHaveTextContent("Sidebar Open");


   window.localStorage.removeItem('access_token');
 });
>>>>>>> 4254aca7ad02b67fa94d75a298086c4c69b2ddd0
});
