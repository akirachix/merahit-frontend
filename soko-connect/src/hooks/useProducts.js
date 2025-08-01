import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchAPI";

export const useProducts = (period = "all") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoint = period === "all" ? "/products/" : `/products/?period=${period}`;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData(endpoint);
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => (mounted = false);
  }, [period]);

  return { data, loading, error };
};
