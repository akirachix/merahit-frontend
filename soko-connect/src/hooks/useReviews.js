import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchAPI";

export const useReviews = (period = "all") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoint = period === "all" ? "/reviews/" : `/reviews/?period=${period}`;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData(endpoint);
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load reviews");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchReviews();
    return () => (mounted = false);
  }, [period]);

  return { data, loading, error };
};
