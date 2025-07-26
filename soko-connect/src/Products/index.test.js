import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ProductsIndex from "./index";

jest.mock("../hooks/usefetchproducts/index", () => ({
  useProducts: () => ({
    loading: false,
    error: null,
    products: [
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
    ],
  }),
}));

describe("ProductsIndex component", () => {
  test("renders products, allows search/filter, opens and closes modal", () => {
    render(<ProductsIndex />);

    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/category/i)).toBeInTheDocument();

    expect(screen.getByText("Carrot")).toBeInTheDocument();
    expect(screen.getByText("Wheat")).toBeInTheDocument();
    expect(screen.getByText("Vegetable")).toBeInTheDocument();
    expect(screen.getByText("Cereals")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search products/i), { target: { value: "wheat" } });
    expect(screen.getByText("Wheat")).toBeInTheDocument();
    expect(screen.queryByText("Carrot")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search products/i), { target: { value: "" } });

    fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: "vegetable" } });
    expect(screen.getByText("Carrot")).toBeInTheDocument();
    expect(screen.queryByText("Wheat")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: "all" } });

    const carrotRow = screen.getByText("Carrot").closest("tr");
    const viewButton = within(carrotRow).getByText(/view/i);
    fireEvent.click(viewButton);

    expect(screen.getByRole("heading", { name: "Carrot" })).toBeInTheDocument();
    expect(screen.getByText(/fresh carrots/i)).toBeInTheDocument();
    expect(screen.getByText(/vegetable/i)).toBeInTheDocument();
    expect(screen.getByText(/ksh 50/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close/i));
    expect(screen.queryByRole("heading", { name: "Carrot" })).not.toBeInTheDocument();

    const wheatRow = screen.getByText("Wheat").closest("tr");
    const wheatViewButton = within(wheatRow).getByText(/view/i);
    fireEvent.click(wheatViewButton);

    expect(screen.getByRole("heading", { name: "Wheat" })).toBeInTheDocument();
    expect(screen.getByText(/high quality wheat/i)).toBeInTheDocument();
    expect(screen.getByText(/cereals/i)).toBeInTheDocument();
    expect(screen.getByText(/ksh 120/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close/i));
    expect(screen.queryByRole("heading", { name: "Wheat" })).not.toBeInTheDocument();
  });

  test("shows no product data available if no products", () => {
    jest.mock("../hooks/usefetchproducts/index", () => ({
      useProducts: () => ({
        loading: false,
        error: null,
        products: [],
      }),
    }));

    render(<ProductsIndex />);
    expect(screen.getByText(/no product data available/i)).toBeInTheDocument();
  });
});