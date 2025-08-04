import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchAPI";

export const useUsers = (period = "all") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoint = period === "all" ? "/users/" : `/users/?period=${period}`;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData(endpoint);
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => (mounted = false);
  }, [period]);

  return { data, loading, error };
};
