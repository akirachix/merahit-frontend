import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import OrdersIndex from "./index";

jest.mock("../hooks/useFetchOrders", () => ({
  useOrders: jest.fn(),
}));

import { useOrders } from "../hooks/useFetchOrders";

const sampleOrders = [
  {
    id: 1,
    customer: { full_name: "Customer One" },
    vendor: { full_name: "Vendor One" },
    total_amount: 1000,
    status: "Pending",
    order_date: "2025-07-01T12:00:00Z",
  },
  {
    id: 2,
    customer: { full_name: "Customer Two" },
    vendor: { full_name: "Vendor Two" },
    total_amount: 2000,
    status: "Completed",
    order_date: "2025-07-02T12:00:00Z",
  },
];

describe("OrdersIndex Component", () => {
  test("renders loading state initially", () => {
    useOrders.mockReturnValue({ orders: [], loading: true, error: null });
    render(<OrdersIndex />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    useOrders.mockReturnValue({ orders: [], loading: false, error: "Fetch error" });
    render(<OrdersIndex />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  test("renders list of orders and filters by status correctly", async () => {
    useOrders.mockReturnValue({ orders: sampleOrders, loading: false, error: null });

    render(<OrdersIndex />);

    expect(screen.getByText("Customer One")).toBeInTheDocument();
    expect(screen.getByText("Customer Two")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/filter orders by status/i), { target: { value: "Pending" } });

    await waitFor(() => {
      expect(screen.getByText("Customer One")).toBeInTheDocument();
      expect(screen.queryByText("Customer Two")).not.toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/filter orders by status/i), { target: { value: "Completed" } });

    await waitFor(() => {
      expect(screen.getByText("Customer Two")).toBeInTheDocument();
      expect(screen.queryByText("Customer One")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/filter orders by status/i), { target: { value: "All" } });

    await waitFor(() => {
      expect(screen.getByText("Customer One")).toBeInTheDocument();
      expect(screen.getByText("Customer Two")).toBeInTheDocument();
    });
  });

  test("pagination buttons work", () => {
    const manyOrders = Array.from({ length: 15 }).map((_, i) => ({
      id: i + 1,
      customer: { full_name: `Customer ${i + 1}` },
      vendor: { full_name: `Vendor ${i + 1}` },
      total_amount: (i + 1) * 100,
      status: "Pending",
      order_date: "2025-07-01T12:00:00Z",
    }));

    useOrders.mockReturnValue({ orders: manyOrders, loading: false, error: null });
    render(<OrdersIndex />);

    expect(screen.getByText("Customer 1")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/next page/i));

    expect(screen.getByText("Customer 8")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/previous page/i));

    expect(screen.getByText("Customer 1")).toBeInTheDocument();
  });

  test("modal opens and closes correctly when clicking View button", async () => {
    useOrders.mockReturnValue({ orders: sampleOrders, loading: false, error: null });

    render(<OrdersIndex />);

    const viewButtons = screen.getAllByText(/view/i);
    fireEvent.click(viewButtons[0]);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    expect(screen.getByText(/Order Details/i)).toBeInTheDocument();

    const modal = within(dialog);
    expect(modal.getByText(/Customer One/)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close/i));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("shows message when no orders match filter", () => {
    useOrders.mockReturnValue({ orders: [], loading: false, error: null });

    render(<OrdersIndex />);

    expect(screen.getByText(/no order data available/i)).toBeInTheDocument();
  });
});
