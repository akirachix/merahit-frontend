import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchAPI";

export const useDiscounts = (period = "all") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoint = period === "all" ? "/discounts/" : `/discounts/?period=${period}`;

    const fetchDiscounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData(endpoint);
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load discounts");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDiscounts();
    return () => (mounted = false);
  }, [period]);

  return { data, loading, error };
};
