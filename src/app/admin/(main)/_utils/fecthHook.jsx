"use client";
import { useEffect, useState, useCallback, useContext } from "react";
import { get } from "@/app/_hooks/fetch-hook";
import { AuthContext } from "@/app/(clients)/_provider/useClientProvider";

export function useFetch(url) {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return; // guard for empty url
    setLoading(true);
    setError(null);
    let secret = token || process.env.NEXT_PUBLIC_TOKEN;
    if (!secret) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await get(url, { token: secret });

      console.log("response:", response);
      if (
        response.success &&
        (Array.isArray(response.data.data) ||
          typeof response.data.data === "object")
      ) {
        setData(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Something went wrong");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, token, setData, setLoading, setError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  console.log("useFetch data:", data);
  console.log("useFetch error:", error);

  return { data, loading, error, refetch: fetchData };
}
