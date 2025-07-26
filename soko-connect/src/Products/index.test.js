import React from "react";
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
import ProductsIndex from "./index";

jest.mock("../hooks/usefetchproducts/index", () => ({
  useProducts: jest.fn(),
}));

const mockProducts = [
  {
    id: 1,
    product_name: "okra",
    category: "vegetable",
    stock_unit: "kg",
    stock_quantity: 20,
    price: 100,
    product_image: "okra.jpg",
    description: "Fresh okra",
    created_at: "2025-01-01T12:00:00Z"
  },
  {
    id: 2,
    product_name: "tilapia",
    category: "fish",
    stock_unit: "kg",
    stock_quantity: 15,
    price: 100,
    product_image: "tilapia.jpg",
    description: "Fresh tilapia",
    created_at: "2025-02-01T12:00:00Z"
  }
];

describe("ProductsIndex", () => {
  const { useProducts } = require("../hooks/usefetchproducts/index");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state", () => {
    useProducts.mockReturnValue({ products: [], loading: true, error: null });
    render(<ProductsIndex />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    useProducts.mockReturnValue({ products: [], loading: false, error: "Fetch failed" });
    render(<ProductsIndex />);
    expect(screen.getByText(/Error: Fetch failed/i)).toBeInTheDocument();
  });

  test("renders products table and capitalizes first letter", () => {
    useProducts.mockReturnValue({ products: mockProducts, loading: false, error: null });
    render(<ProductsIndex />);
    expect(screen.getByText("Okra")).toBeInTheDocument();
    expect(screen.getByText("Tilapia")).toBeInTheDocument();
    expect(screen.getByText("Vegetable")).toBeInTheDocument();
    expect(screen.getByText("Fish")).toBeInTheDocument();
    expect(screen.getAllByText("Kg").length).toBe(2);
    expect(screen.getAllByText("KSH 100").length).toBe(2);
  });

  test("filters products by product name and category", () => {
    useProducts.mockReturnValue({ products: mockProducts, loading: false, error: null });
    render(<ProductsIndex />);
    const input = screen.getByPlaceholderText("Search by product or category...");

    fireEvent.change(input, { target: { value: "okra" } });
    expect(screen.getByText("Okra")).toBeInTheDocument();
    expect(screen.queryByText("Tilapia")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "tilapia" } });
    expect(screen.getByText("Tilapia")).toBeInTheDocument();
    expect(screen.queryByText("Okra")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "vegetable" } });
    expect(screen.getByText("Okra")).toBeInTheDocument();
    expect(screen.queryByText("Tilapia")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "fish" } });
    expect(screen.getByText("Tilapia")).toBeInTheDocument();
    expect(screen.queryByText("Okra")).not.toBeInTheDocument();
  });

  test("shows no data message when products empty", () => {
    useProducts.mockReturnValue({ products: [], loading: false, error: null });
    render(<ProductsIndex />);
    expect(screen.getByText(/No product data available/i)).toBeInTheDocument();
  });

  test("shows details modal with capitalized product and stock unit", async () => {
    useProducts.mockReturnValue({ products: mockProducts, loading: false, error: null });
    render(<ProductsIndex />);

    const okraRow = screen.getByText("Okra").closest("tr");
    fireEvent.click(within(okraRow).getByText("View"));

    await waitFor(() => {
      const modal = screen.getByText("Product Details").closest(".products-modal-details");
      expect(modal).toBeInTheDocument();

      expect(within(modal).getByText("Okra")).toBeInTheDocument();
      expect(within(modal).getByText("Kg")).toBeInTheDocument();
      expect(within(modal).getByText("Vegetable")).toBeInTheDocument();
      expect(within(modal).getByText("KSH 100")).toBeInTheDocument();
      expect(within(modal).getByText("Fresh okra")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByText("Product Details")).not.toBeInTheDocument();
    });
  });

  test("pagination works", () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      product_name: i % 2 === 0 ? "okra" : "tilapia",
      category: i % 2 === 0 ? "vegetable" : "fish",
      stock_unit: "kg",
      stock_quantity: 10 + i,
      price: 100,
      product_image: null,
      description: i % 2 === 0 ? "Fresh okra" : "Fresh tilapia",
      created_at: "2025-01-01T12:00:00Z"
    }));
    useProducts.mockReturnValue({ products: manyProducts, loading: false, error: null });
    render(<ProductsIndex />);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getAllByText("Okra").length + screen.getAllByText("Tilapia").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });
});