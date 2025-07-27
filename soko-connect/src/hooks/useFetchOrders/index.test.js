import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { useOrders } from "./index";
import { fetchData } from "../../utils/fetchAPI";

jest.mock("../../utils/fetchAPI");

function HookWrapper({ hook }) {
  const value = hook();
  React.useEffect(() => {
    window.hookResult = value;
  }, [value]);
  return null;
}

describe("useOrders hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.hookResult = null;
  });

  test("dummy test to pass if no other tests", () => {
    expect(true).toBe(true);
  });

  test("loads orders successfully", async () => {
    const mockOrders = [
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

    fetchData.mockResolvedValueOnce(mockOrders);

    await act(async () => {
      render(<HookWrapper hook={useOrders} />);
    });

    await waitFor(() => {
      expect(window.hookResult.loading).toBe(false);
      expect(window.hookResult.error).toBeNull();
      expect(window.hookResult.orders).toEqual(mockOrders);
    });

    expect(fetchData).toHaveBeenCalledWith("/order/");
  });

  test("handles fetch error correctly", async () => {
    const errorMessage = "Fetch failed";
    fetchData.mockRejectedValueOnce(new Error(errorMessage));

    await act(async () => {
      render(<HookWrapper hook={useOrders} />);
    });

    await waitFor(() => {
      expect(window.hookResult.loading).toBe(false);
      expect(window.hookResult.orders).toEqual([]);
      expect(window.hookResult.error).toBe(errorMessage);
    });

    expect(fetchData).toHaveBeenCalledWith("/order/");
  });

  test("fetchOrderDetails returns empty object (Promise)", async () => {
    await act(async () => {
      render(<HookWrapper hook={useOrders} />);
    });

    await waitFor(() => {
      expect(window.hookResult).not.toBeNull();
    });

    expect(typeof window.hookResult.fetchOrderDetails).toBe("function");

    const fetchResult = window.hookResult.fetchOrderDetails(123);
    expect(fetchResult).toBeInstanceOf(Promise);

    const resolvedData = await fetchResult;
    expect(resolvedData).toEqual({});
  });
});
