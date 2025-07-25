import React from "react";
import { render, waitFor } from "@testing-library/react";
import { useReviews } from "./index";
import { fetchData } from "../../utils/fetchAPI";

jest.mock("../../utils/fetchAPI");

function HookWrapper({ hook }) {
  const value = hook();
  React.useEffect(() => {
    window.hookResult = value;
  }, [value]);
  return null;
}

describe("useReviews hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.hookResult = null;
  });

  test("dummy test to pass if no other tests", () => {
    expect(true).toBe(true);
  });

  test("loads reviews successfully", async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: "Great product" },
      { id: 2, rating: 4, comment: "Good service" },
    ];
    fetchData.mockResolvedValueOnce(mockReviews);

    render(<HookWrapper hook={useReviews} />);

    await waitFor(() => {
      expect(window.hookResult.loading).toBe(false);
      expect(window.hookResult.error).toBeNull();
      expect(window.hookResult.reviews).toEqual(mockReviews);
    });

    expect(fetchData).toHaveBeenCalledWith("/Review/");
  });

  test("handles fetch error correctly", async () => {
    const errorMessage = "Fetch failed";
    fetchData.mockRejectedValueOnce(new Error(errorMessage));

    render(<HookWrapper hook={useReviews} />);

    await waitFor(() => {
      expect(window.hookResult.loading).toBe(false);
      expect(window.hookResult.reviews).toEqual([]);
      expect(window.hookResult.error).toBe(errorMessage);
    });

    expect(fetchData).toHaveBeenCalledWith("/Review/");
  });
});
