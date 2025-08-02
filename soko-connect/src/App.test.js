





import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";


jest.mock("./shared-components/Header/index", () => () => <div data-testid="header">Header</div>);

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

});
