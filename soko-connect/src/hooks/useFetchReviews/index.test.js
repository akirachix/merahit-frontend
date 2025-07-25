import React, { useEffect } from "react";
import { render, waitFor, act } from "@testing-library/react";
import { useReviews } from "./";
import * as fetchAPI from "../../utils/fetchAPI";

function TestComponent({ onHookReady }) {
  const hookResult = useReviews();

  useEffect(() => {
    if (onHookReady) onHookReady(hookResult);
  }, [hookResult, onHookReady]);

  return null;
}


function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("useReviews hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading=true and reviews = []", async () => {
    const def = deferred();
    jest.spyOn(fetchAPI, "fetchData").mockReturnValueOnce(def.promise);

    let hookResult;
    const onHookReady = (result) => {
      hookResult = result;
    };

    act(() => {
      render(<TestComponent onHookReady={onHookReady} />);
    });

    expect(hookResult.loading).toBe(true);
    expect(hookResult.reviews).toEqual([]);
    expect(hookResult.error).toBeNull();

    await act(async () => {
      def.resolve([]);
      await def.promise;
    });
  });

  it("should fetch reviews and update state accordingly", async () => {
    const mockReviews = [
      { id: 1, text: "Great review" },
      { id: 2, text: "Nice place" },
    ];

    jest.spyOn(fetchAPI, "fetchData").mockResolvedValueOnce(mockReviews);

    let hookResult;
    const onHookReady = (result) => {
      hookResult = result;
    };

    await act(async () => {
      render(<TestComponent onHookReady={onHookReady} />);
    });

    await waitFor(() => {
      expect(hookResult.loading).toBe(false);
      expect(hookResult.reviews).toEqual(mockReviews);
      expect(hookResult.error).toBeNull();
    });
  });

  it("should handle errors when fetching reviews", async () => {
    const errorMessage = "Network error";
    jest.spyOn(fetchAPI, "fetchData").mockRejectedValueOnce(new Error(errorMessage));

    let hookResult;
    const onHookReady = (result) => {
      hookResult = result;
    };

    await act(async () => {
      render(<TestComponent onHookReady={onHookReady} />);
    });

    await waitFor(() => {
      expect(hookResult.loading).toBe(false);
      expect(hookResult.reviews).toEqual([]);
      expect(hookResult.error).toBe(errorMessage);
    });
  });
});
