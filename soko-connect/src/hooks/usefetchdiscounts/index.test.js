import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useDiscounts } from "./index";

jest.mock("../../utils/fetchAPI", () => ({
  fetchData: jest.fn(),
}));
import { fetchData } from "../../utils/fetchAPI";

function TestComponent() {
  const { discounts, loading, error } = useDiscounts();
  return (
    <div>
      <span data-testid="loading">{loading ? "loading" : "loaded"}</span>
      <span data-testid="error">{error || ""}</span>
      <span data-testid="discounts">{JSON.stringify(discounts)}</span>
    </div>
  );
}

describe("useDiscounts (with TestComponent)", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches discounts and sets loading to false on success", async () => {
    const mockDiscounts = [
      { id: 1, productName: "Laptop", vendor: "TechVendor", oldPrice: 1000, newPrice: 800 },
      { id: 2, productName: "Phone", vendor: "MobileStore", oldPrice: 1500, newPrice: 1200 },
    ];
    fetchData.mockResolvedValue(mockDiscounts);

    render(<TestComponent />);
    expect(screen.getByTestId("loading").textContent).toBe("loading");

    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("loaded"));

    const discounts = JSON.parse(screen.getByTestId("discounts").textContent);
    expect(discounts).toHaveLength(2);
    expect(discounts[0]).toMatchObject({ productName: "Laptop", vendor: "TechVendor" });
    expect(discounts[1]).toMatchObject({ productName: "Phone", vendor: "MobileStore" });
    expect(screen.getByTestId("error").textContent).toBe("");
  });

  it("shows error and clears discounts on fetch error", async () => {
    fetchData.mockRejectedValue(new Error("Network error"));

    render(<TestComponent />);
    expect(screen.getByTestId("loading").textContent).toBe("loading");

    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("loaded"));

    expect(screen.getByTestId("discounts").textContent).toBe("[]");
    expect(screen.getByTestId("error").textContent).toBe("Network error");
  });

  it("handles empty discounts array", async () => {
    fetchData.mockResolvedValue([]);
    render(<TestComponent />);
    expect(screen.getByTestId("loading").textContent).toBe("loading");
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("loaded"));
    expect(screen.getByTestId("discounts").textContent).toBe("[]");
    expect(screen.getByTestId("error").textContent).toBe("");
  });
});