import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./index";

describe("Header Component", () => {
  test("renders title and logo", () => {
    render(<Header onSidebarToggle={jest.fn()} sidebarOpen={true} />);
    expect(screen.getByText("Soko Connect Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveClass("header-user");
  });

  test("does not show hamburger button when sidebar is open", () => {
    render(<Header onSidebarToggle={jest.fn()} sidebarOpen={true} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("calls onSidebarToggle when hamburger button is clicked", () => {
    const toggleMock = jest.fn();
    render(<Header onSidebarToggle={toggleMock} sidebarOpen={false} />);
    fireEvent.click(screen.getByRole("button"));
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });
});
