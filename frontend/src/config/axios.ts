import axios from "axios";
import { API_BASE_URL } from "./api";
import { authUtils } from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

const PUBLIC_ENDPOINTS = [
  "/getCode",
  "/validateCode",
  "/createAccount",
];

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url?.endsWith(endpoint) || config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = authUtils.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized error:", {
        url: error.config?.url,
        message: error.response?.data?.message,
        hasToken: !!authUtils.getToken()
      });
      authUtils.clearToken();
      
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

