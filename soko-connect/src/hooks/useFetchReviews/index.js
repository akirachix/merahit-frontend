import { useState, useEffect } from "react";
import { fetchData } from "../../utils/fetchAPI";
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchData("/reviews/");
        setReviews(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setReviews([]);
      }
    })();
  }, []);
  return { reviews, loading, error };
};






