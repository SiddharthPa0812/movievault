import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useEntries(params = {}) {
  const [entries, setEntries] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEntries = async (nextParams = params) => {
    setLoading(true);
    setError("");
    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(nextParams).filter(([, value]) => value !== "" && value !== null && value !== undefined),
      );
      const { data } = await api.get("/entries/", { params: cleanedParams });
      setEntries(data.results || data);
      setCount(data.count || data.length || 0);
    } catch (fetchError) {
      setError("Unable to load entries right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(params);
  }, [JSON.stringify(params)]);

  return { entries, count, loading, error, refetch: fetchEntries };
}
