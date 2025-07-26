jest.setTimeout(5000);

import React from "react";
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
import ProductsIndex from "./index";

jest.mock("../hooks/usefetchproducts/index", () => ({
  useProducts: jest.fn(),
}));

const mockProducts = [
  {
    id: 1,
    product_name: "fish",
    category: "fish",
    stock_unit: "kg",
    stock_quantity: 20,
    price: 200,
    product_image: "fish.jpg",
    description: "Fresh fish",
    created_at: "2025-01-01T12:00:00Z"
  }
];

describe("ProductsIndex", () => {
  const { useProducts } = require("../hooks/usefetchproducts/index");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders products table and opens/closes modal safely", async () => {
    useProducts.mockReturnValue({ products: mockProducts, loading: false, error: null });
    render(<ProductsIndex />);
    expect(screen.getByText("Fish")).toBeInTheDocument();

    const fishRow = screen.getByText("Fish").closest("tr");
    fireEvent.click(within(fishRow).getByText("View"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});