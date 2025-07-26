import React from "react";
import { render, waitFor } from "@testing-library/react";
import { useProducts } from "./index";

jest.mock("../../utils/fetchAPI", () => ({
  fetchData: jest.fn(),
}));
import { fetchData } from "../../utils/fetchAPI";

const mockProducts = [
  { id: 1, product_name: "Test Product", product_image: "img.png", price: 100 },
  { id: 2, product_name: "Another Product", product_image: "img2.png", price: 200 },
];

function HookTestComponent({ onResult }) {
  const hook = useProducts();
  React.useEffect(() => {
    onResult(hook);
  }, [hook, onResult]);
  return null;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("loads and returns products", async () => {
  fetchData.mockResolvedValueOnce(mockProducts);

  const results = [];
  render(<HookTestComponent onResult={hook => results.push(hook)} />);
  await waitFor(() => expect(results[results.length - 1].loading).toBe(false));
  const hook = results[results.length - 1];

  expect(hook.error).toBeNull();
  expect(hook.products).toEqual(mockProducts);
});

test("handles fetch error gracefully", async () => {
  fetchData.mockRejectedValueOnce(new Error("Network error"));

  const results = [];
  render(<HookTestComponent onResult={hook => results.push(hook)} />);
  await waitFor(() => expect(results[results.length - 1].loading).toBe(false));
  const hook = results[results.length - 1];

  expect(hook.error).toBe("Network error");
  expect(hook.products).toEqual([]);
});