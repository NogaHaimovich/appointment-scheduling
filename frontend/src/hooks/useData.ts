import { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/api";

export interface UseDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useData<T = any>(
  endpoint: string,
  delay: number = 0,
  body?: any,
  enabled: boolean = true   
): UseDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint || !enabled) return;  

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<T>(
        `${API_BASE_URL}${endpoint}`,
        {
          params: body,
          signal: abortRef.current.signal,
        }
      );

      setData(response.data);
    } catch (err) {
      if (axios.isCancel(err)) return;

      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
        axiosError.message ||
        "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, body, enabled]);

  useEffect(() => {
    if (!enabled) return;   

    if (delay > 0) {
      timeoutRef.current = setTimeout(fetchData, delay);
    } else {
      fetchData();
    }

    return () => {
      abortRef.current?.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fetchData, delay, enabled]);

  const refetch = useCallback(() => {
    if (enabled) fetchData();
  }, [fetchData, enabled]);

  return { data, loading, error, refetch };
}
