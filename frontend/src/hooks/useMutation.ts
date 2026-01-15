import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import axiosInstance from "../config/axios";

export interface UseMutationReturn<TData, TVariables> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  mutate: (variables: TVariables, config?: AxiosRequestConfig) => Promise<TData | undefined>;
  reset: () => void;
}

export type HttpMethod = "post" | "put" | "patch" | "delete";

export function useMutation<TData, TVariables>(
  endpoint: string,
  method: HttpMethod = "post"
): UseMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables, config?: AxiosRequestConfig): Promise<TData | undefined> => {
      if (!endpoint) {
        setError("Endpoint is required");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let response;
        const requestConfig = {
          ...config,
        };

        switch (method) {
          case "post":
            response = await axiosInstance.post<TData>(endpoint, variables, requestConfig);
            break;
          case "put":
            response = await axiosInstance.put<TData>(endpoint, variables, requestConfig);
            break;
          case "patch":
            response = await axiosInstance.patch<TData>(endpoint, variables, requestConfig);
            break;
          case "delete":
            response = await axiosInstance.delete<TData>(endpoint, {
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

