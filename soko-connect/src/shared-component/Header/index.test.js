import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./index"; 

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }) => {
    const iconName = icon.iconName || "unknown";
    return <i data-testid={`icon-${iconName}`} />;
  },
}));

jest.mock("@fortawesome/free-solid-svg-icons", () => ({
  faBars: { iconName: "bars" },
  faTimes: { iconName: "times" },
}));

describe("Header Component", () => {
  const mockSetSidebarOpen = jest.fn();

  const renderHeader = (props = {}) => {
    return render(
      <Header
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockSetSidebarOpen.mockClear();
  });

  test("renders header with hamburger button, title, and logo", () => {
    renderHeader();

    const hamburgerButton = screen.getByRole("button", {
      name: /open sidebar/i,
    });
    expect(hamburgerButton).toBeInTheDocument();
    expect(screen.getByTestId("icon-bars")).toBeInTheDocument();

    expect(screen.getByText("Soko Connect Admin Dashboard")).toBeInTheDocument();

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "Images/sokoconnectlogo-removebg-preview.png");
    expect(logo).toHaveClass("header-user");
  });

  test("hamburger button toggles sidebar state when clicked", () => {
    renderHeader();

    const hamburgerButton = screen.getByRole("button", {
      name: /open sidebar/i,
    });

    fireEvent.click(hamburgerButton);

    expect(mockSetSidebarOpen).toHaveBeenCalledTimes(1);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(expect.any(Function));

    const toggleFunction = mockSetSidebarOpen.mock.calls[0][0];
    expect(toggleFunction(false)).toBe(true);
    expect(toggleFunction(true)).toBe(false);
  });

  test("applies 'shifted' class to header-content when sidebarOpen is true", () => {
    renderHeader({ sidebarOpen: true });

    const headerContent = screen.getByText("Soko Connect Admin Dashboard").parentElement;
    expect(headerContent).toHaveClass("header-content shifted");

    expect(screen.getByTestId("icon-times")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close sidebar/i })).toBeInTheDocument();
  });

  test("does not apply 'shifted' class to header-content when sidebarOpen is false", () => {
    renderHeader({ sidebarOpen: false });

    const headerContent = screen.getByText("Soko Connect Admin Dashboard").parentElement;
    expect(headerContent).toHaveClass("header-content");
    expect(headerContent).not.toHaveClass("shifted");

    expect(screen.getByTestId("icon-bars")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open sidebar/i })).toBeInTheDocument();
  });

  test("hamburger button has correct ARIA attributes", () => {
    renderHeader({ sidebarOpen: false });
    let hamburgerButton = screen.getByRole("button", { name: /open sidebar/i });
    expect(hamburgerButton).toHaveAttribute("aria-expanded", "false");

    renderHeader({ sidebarOpen: true });
    hamburgerButton = screen.getByRole("button", { name: /close sidebar/i });
    expect(hamburgerButton).toHaveAttribute("aria-expanded", "true");
  });

  test("header has correct class", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("admin-header");
  });
});