

import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ProductsIndex from "./index";
import * as useFetchProductsModule from "../hooks/usefetchproducts/index";

jest.mock("../hooks/usefetchproducts/index", () => ({
  useProducts: jest.fn(),
}));

const sampleProducts = [
  {
    id: "1",
    product_name: "carrot",
    category: "vegetable",
    stock_unit: "kg",
    stock_quantity: 40,
    price: 50,
    product_image: "/carrot.png",
    description: "Fresh carrots",
    created_at: "2023-01-01T10:00:00Z",
  },
  {
    id: "2",
    product_name: "wheat",
    category: "cereals",
    stock_unit: "kg",
    stock_quantity: 100,
    price: 120,
    product_image: "/wheat.png",
    description: "High quality wheat",
    created_at: "2023-03-01T09:00:00Z",
  },
];

describe("ProductsIndex component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state", () => {
    useFetchProductsModule.useProducts.mockReturnValue({
      loading: true,
      error: null,
      products: [],
    });
    render(<ProductsIndex />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    useFetchProductsModule.useProducts.mockReturnValue({
      loading: false,
      error: "Something went wrong",
      products: [],
    });
    render(<ProductsIndex />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  test("renders products, filters by search and category, opens and closes modal", async () => {
    useFetchProductsModule.useProducts.mockReturnValue({
      loading: false,
      error: null,
      products: sampleProducts,
    });

    render(<ProductsIndex />);

    const rowgroups = screen.getAllByRole("rowgroup");
    const tbody = rowgroups.find((rg) => rg.tagName.toLowerCase() === "tbody") || rowgroups[1];

    expect(screen.getByText("Carrot")).toBeInTheDocument();
    expect(screen.getByText("Wheat")).toBeInTheDocument();
    expect(within(tbody).getByText("Vegetable")).toBeInTheDocument();
    expect(within(tbody).getByText("Cereals")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search products/i), {
      target: { value: "wheat" },
    });

    await waitFor(() => {
      expect(screen.getByText("Wheat")).toBeInTheDocument();
      expect(screen.queryByText("Carrot")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/search products/i), {
      target: { value: "" },
    });

    await waitFor(() => {
      expect(screen.getByText("Carrot")).toBeInTheDocument();
      expect(screen.getByText("Wheat")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/filter by category/i), {
      target: { value: "vegetable" },
    });

    await waitFor(() => {
      expect(screen.getByText("Carrot")).toBeInTheDocument();
      expect(screen.queryByText("Wheat")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/filter by category/i), {
      target: { value: "all" },
    });

    await waitFor(() => {
      expect(screen.getByText("Carrot")).toBeInTheDocument();
      expect(screen.getByText("Wheat")).toBeInTheDocument();
    });

    const carrotRow = screen.getByText("Carrot").closest("tr");
    const viewButton = within(carrotRow).getByText(/view/i);
    fireEvent.click(viewButton);

    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();

    const modalWithin = within(modal);

    expect(modalWithin.getByRole("heading", { name: "Carrot" })).toBeInTheDocument();
    expect(modalWithin.getByText(/fresh carrots/i)).toBeInTheDocument();
    expect(modalWithin.getByText(/vegetable/i)).toBeInTheDocument();
    expect(modalWithin.getByText(/ksh 50/i)).toBeInTheDocument();

    fireEvent.click(modalWithin.getByText(/close/i));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("shows no product data available message when products list is empty", () => {
    useFetchProductsModule.useProducts.mockReturnValue({
      loading: false,
      error: null,
      products: [],
    });
    render(<ProductsIndex />);
    expect(screen.getByText(/no product data available/i)).toBeInTheDocument();
  });

  test("pagination buttons navigate pages correctly", async () => {
    const manyProducts = Array.from({ length: 15 }).map((_, i) => ({
      id: (i + 1).toString(),
      product_name: `product${i + 1}`,
      category: "vegetable",
      stock_unit: "kg",
      stock_quantity: 10 + i,
      price: 100 + i,
      product_image: "/fallback-image.png",
      description: `Description ${i + 1}`,
      created_at: "2023-01-01T12:00:00Z",
    }));

    useFetchProductsModule.useProducts.mockReturnValue({
      loading: false,
      error: null,
      products: manyProducts,
    });

    render(<ProductsIndex />);

    expect(screen.getByText("Product1")).toBeInTheDocument();
    expect(screen.queryByText("Product7")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/next page/i));

    expect(screen.getByText("Product7")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/previous page/i));

    expect(screen.getByText("Product1")).toBeInTheDocument();
  });
});


