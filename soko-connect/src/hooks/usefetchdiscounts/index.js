import { useState, useEffect} from "react";
import { fetchData } from "../../utils/fetchAPI";

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const discountsData = await fetchData("/discounts/");
        setDiscounts(discountsData || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setDiscounts([]);
        setLoading(false);
      }
    })();
  }, []);


  return {
    discounts,
    loading,
    error,
  };
};