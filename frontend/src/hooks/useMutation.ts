import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/api";

export interface UseMutationReturn<TData, TVariables> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  mutate: (variables: TVariables, config?: Record<string, any>) => Promise<TData | undefined>;
  reset: () => void;
}

export type HttpMethod = "post" | "put" | "patch" | "delete";

export function useMutation<TData = any, TVariables = any>(
  endpoint: string,
  method: HttpMethod = "post"
): UseMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables, config?: Record<string, any>): Promise<TData | undefined> => {
      if (!endpoint) {
        setError("Endpoint is required");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let response;
        const url = `${API_BASE_URL}${endpoint}`;
        const requestConfig = {
          ...config,
        };

        switch (method) {
          case "post":
            response = await axios.post<TData>(url, variables, requestConfig);
            break;
          case "put":
            response = await axios.put<TData>(url, variables, requestConfig);
            break;
          case "patch":
            response = await axios.patch<TData>(url, variables, requestConfig);
            break;
          case "delete":
            response = await axios.delete<TData>(url, {
              ...requestConfig,
              data: variables,
            });
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        setData(response.data);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}

