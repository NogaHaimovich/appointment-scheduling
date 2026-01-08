import { useMemo } from "react";
import type { PatientsResponse } from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { useData } from "./useData";
import { authUtils } from "../utils/auth";

export const usePatients = () => {
  const accountId = authUtils.getAccountIdFromToken();
  const queryParams = useMemo(
    () => (accountId ? { accountId } : undefined),
    [accountId]
  );

  const { data, loading } = useData<PatientsResponse>(
    API_ENDPOINTS.getPatients,
    0,
    queryParams,
    !!accountId
  );

  const patients = useMemo(() => data?.patients || [], [data?.patients]);

  return {
    patients,
    loadingPatients: loading,
  };
};

