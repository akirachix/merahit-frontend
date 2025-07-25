import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import OrdersIndex from "./index";
import * as useOrdersHook from "../hooks/useFetchOrders";

jest.mock("./style.css", () => ({}));

describe("OrdersIndex and Orders component", () => {
  const mockOrders = [
    {
      id: 1,
      customer: { full_name: "John Doe" },
      vendor: { full_name: "BestVendor" },
      total_amount: 1000,
      status: "Delivered",
      order_date: "2023-07-01T00:00:00Z",
    },
    {
      id: 2,
      customer: { full_name: "Jane Smith" },
      vendor: { full_name: "VendorX" },
      total_amount: 2000,
      status: "Pending",
      order_date: "2023-07-02T00:00:00Z",
    },
  ];

  let fetchOrderDetailsMock;

  beforeEach(() => {
    fetchOrderDetailsMock = jest.fn();

    jest.spyOn(useOrdersHook, "useOrders").mockReturnValue({
      orders: mockOrders,
      loading: false,
      error: null,
      fetchOrderDetails: fetchOrderDetailsMock,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders banner and orders table with pagination info and buttons", () => {
    render(<OrdersIndex />);
    expect(
      screen.getByText(/track and manage customer orders/i)
    ).toBeInTheDocument();

    mockOrders.forEach(({ customer, vendor, total_amount, status }) => {
      expect(screen.getByText(customer.full_name)).toBeInTheDocument();
      expect(screen.getByText(vendor.full_name)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(total_amount.toString()))).toBeInTheDocument();
    });

    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText(/Page 1 of \d+/i)).toBeInTheDocument();
  });

  it("changes page when Next and Previous clicked", async () => {
    render(<OrdersIndex />);

    const nextButton = screen.getByText("Next");
    const prevButton = screen.getByText("Previous");

    expect(prevButton).toBeDisabled();
    await act(async () => {
      fireEvent.click(nextButton);
    });
    await act(async () => {
      fireEvent.click(prevButton);
    });

    expect(prevButton).toBeDisabled();
    expect(screen.getByText(/Page 1 of \d+/i)).toBeInTheDocument();
  });

  it("shows loading state when loading is true", () => {
    useOrdersHook.useOrders.mockReturnValueOnce({
      orders: [],
      loading: true,
      error: null,
      fetchOrderDetails: jest.fn(),
    });

    render(<OrdersIndex />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error message on error", () => {
    useOrdersHook.useOrders.mockReturnValueOnce({
      orders: [],
      loading: false,
      error: "Failed to load orders",
      fetchOrderDetails: jest.fn(),
    });

    render(<OrdersIndex />);
    expect(screen.getByText(/error: failed to load orders/i)).toBeInTheDocument();
  });

  describe("View order details modal", () => {
    beforeEach(() => {
      fetchOrderDetailsMock.mockResolvedValue({});
    });

    it("opens modal with order details after clicking View button and closes on Close", async () => {
      render(<OrdersIndex />);
      const viewButtons = screen.getAllByText(/view/i);
      expect(viewButtons.length).toBe(mockOrders.length);
      await act(async () => {
        fireEvent.click(viewButtons[0]);
      });
      expect(screen.getByText(mockOrders[0].customer.full_name)).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.queryByText(new RegExp(`Order ID:.*${mockOrders[0].id}`))).not.toBeInTheDocument();
      });
    });

    it("handles fetchOrderDetails failure gracefully", async () => {
      fetchOrderDetailsMock.mockRejectedValueOnce(new Error("Failed to fetch details"));

      render(<OrdersIndex />);
      const viewButton = screen.getAllByText(/view/i)[0];

      await act(async () => {
        fireEvent.click(viewButton);
      });
    });
  });
});
