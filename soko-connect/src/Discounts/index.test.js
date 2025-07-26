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
      product_name: "apple",
      product_image: "apple.jpg",
      stock_unit: "piece",
    },
    vendor: { full_name: "Vendor One" },
    old_price: 100,
    new_price: 80,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
  },
  {
    id: 2,
    product: {
      product_name: "banana",
      product_image: null,
      stock_unit: "bunch",
    },
    vendor: { full_name: "Vendor Two" },
    old_price: 50,
    new_price: 45,
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

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Vendor One")).toBeInTheDocument();
    expect(screen.getByText("Vendor Two")).toBeInTheDocument();
    expect(screen.getByText("KSH 100")).toBeInTheDocument();
    expect(screen.getByText("KSH 80")).toBeInTheDocument();
    expect(screen.getByText("KSH 50")).toBeInTheDocument();
    expect(screen.getByText("KSH 45")).toBeInTheDocument();
  });

  test("filters discounts by product name and vendor name", () => {
    useDiscounts.mockReturnValue({ discounts: mockDiscounts, loading: false, error: null });
    render(<DiscountsIndex />);
    const input = screen.getByPlaceholderText("Search by product or vendor...");

    fireEvent.change(input, { target: { value: "ban" } });
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "vendor one" } });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });

  test("shows no data message when discounts empty", () => {
    useDiscounts.mockReturnValue({ discounts: [], loading: false, error: null });
    render(<DiscountsIndex />);
    expect(screen.getByText(/No discount data available/i)).toBeInTheDocument();
  });

  test("shows details modal with capitalized product and stock unit", async () => {
    useDiscounts.mockReturnValue({ discounts: mockDiscounts, loading: false, error: null });
    render(<DiscountsIndex />);

    const appleRow = screen.getByText("Apple").closest("tr");
    expect(appleRow).toBeInTheDocument();


    fireEvent.click(within(appleRow).getByText("View"));

    await waitFor(() => {
      const modal = screen.getByText("Discount Details").closest(".discounts-modal-details");
      expect(modal).toBeInTheDocument();

      expect(within(modal).getByText("Apple")).toBeInTheDocument();
      expect(within(modal).getByText("Piece")).toBeInTheDocument();
      expect(within(modal).getByText("Vendor One")).toBeInTheDocument();
      expect(within(modal).getByText("KSH 100")).toBeInTheDocument();
      expect(within(modal).getByText("KSH 80")).toBeInTheDocument();
    });


    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText("Discount Details")).not.toBeInTheDocument();
  });

  test("pagination works", () => {
    const manyDiscounts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      product: { product_name: `item${i}`, product_image: null, stock_unit: "unit" },
      vendor: { full_name: `Vendor${i}` },
      old_price: 100 + i,
      new_price: 90 + i,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
    }));
    useDiscounts.mockReturnValue({ discounts: manyDiscounts, loading: false, error: null });
    render(<DiscountsIndex />);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Item0")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });
});