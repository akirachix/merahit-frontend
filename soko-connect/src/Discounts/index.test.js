import React from "react";
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
import DiscountsIndex from "./index";

jest.mock("../hooks/usefetchdiscounts/index", () => ({
  useDiscounts: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useLocation: () => ({ pathname: "/discounts" }),
}));

const mockDiscounts = [
  {
    id: 1,
    product: {
      product_name: "onion",
      product_image: "onion.jpg",
      stock_unit: "kg",
    },
    vendor: { full_name: "Vendor One" },
    old_price: 120,
    new_price: 110,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
  },
  {
    id: 2,
    product: {
      product_name: "cabbage",
      product_image: "cabbage.jpg",
      stock_unit: "kg",
    },
    vendor: { full_name: "Vendor Two" },
    old_price: 40,
    new_price: 40,
    start_date: "2025-02-01",
    end_date: "2025-10-31",
  },
];

describe("DiscountsIndex", () => {
  const { useDiscounts } = require("../hooks/usefetchdiscounts/index");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state", () => {
    useDiscounts.mockReturnValue({ discounts: [], loading: true, error: null });
    render(<DiscountsIndex />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    useDiscounts.mockReturnValue({ discounts: [], loading: false, error: "Fetch failed" });
    render(<DiscountsIndex />);
    expect(screen.getByText(/Error: Fetch failed/i)).toBeInTheDocument();
  });

  test("renders discounts table and capitalizes first letter", () => {
    useDiscounts.mockReturnValue({ discounts: mockDiscounts, loading: false, error: null });
    render(<DiscountsIndex />);

    expect(screen.getByText("Onion")).toBeInTheDocument();
    expect(screen.getByText("Cabbage")).toBeInTheDocument();
    expect(screen.getByText("Vendor One")).toBeInTheDocument();
    expect(screen.getByText("Vendor Two")).toBeInTheDocument();
    expect(screen.getByText("KSH 120")).toBeInTheDocument();
    expect(screen.getByText("KSH 110")).toBeInTheDocument();
    expect(screen.getAllByText("KSH 40").length).toBeGreaterThan(0);
  });

  test("filters discounts by product name and vendor name", () => {
    useDiscounts.mockReturnValue({ discounts: mockDiscounts, loading: false, error: null });
    render(<DiscountsIndex />);
    const input = screen.getByPlaceholderText("Search by product or vendor...");

    fireEvent.change(input, { target: { value: "cabbage" } });
    expect(screen.getByText("Cabbage")).toBeInTheDocument();
    expect(screen.queryByText("Onion")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "vendor one" } });
    expect(screen.getByText("Onion")).toBeInTheDocument();
    expect(screen.queryByText("Cabbage")).not.toBeInTheDocument();
  });

  test("shows no data message when discounts empty", () => {
    useDiscounts.mockReturnValue({ discounts: [], loading: false, error: null });
    render(<DiscountsIndex />);
    expect(screen.getByText(/No discount data available/i)).toBeInTheDocument();
  });

  test("shows details modal with capitalized product and stock unit", async () => {
    useDiscounts.mockReturnValue({ discounts: mockDiscounts, loading: false, error: null });
    render(<DiscountsIndex />);

    const onionRow = screen.getByText("Onion").closest("tr");
    expect(onionRow).toBeInTheDocument();

    fireEvent.click(within(onionRow).getByText("View"));

    await waitFor(() => {
      const modal = screen.getByText("Discount Details").closest(".discounts-modal-details");
      expect(modal).toBeInTheDocument();

      expect(within(modal).getByText("Onion")).toBeInTheDocument();
      expect(within(modal).getByText("Kg")).toBeInTheDocument();
      expect(within(modal).getByText("Vendor One")).toBeInTheDocument();
      expect(within(modal).getByText("KSH 120")).toBeInTheDocument();
      expect(within(modal).getByText("KSH 110")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText("Discount Details")).not.toBeInTheDocument();
  });

  test("pagination works", () => {
    const manyDiscounts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      product: { product_name: i % 2 === 0 ? "onion" : "cabbage", product_image: null, stock_unit: "kg" },
      vendor: { full_name: `Vendor${i}` },
      old_price: i % 2 === 0 ? 120 : 40,
      new_price: i % 2 === 0 ? 110 : 40,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
    }));
    useDiscounts.mockReturnValue({ discounts: manyDiscounts, loading: false, error: null });
    render(<DiscountsIndex />);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getAllByText("Onion").length + screen.getAllByText("Cabbage").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });
});