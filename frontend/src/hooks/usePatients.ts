import { useMemo } from "react";
import type { PatientsResponse, AddPatientResponse } from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { useData } from "./useData";
import { useMutation } from "./useMutation";
import { authUtils } from "../utils/auth";

export const usePatients = () => {
  const accountId = authUtils.getAccountIdFromToken();
  const queryParams = useMemo(
    () => (accountId ? { accountId } : undefined),
    [accountId]
  );

  const { data, loading, refetch } = useData<PatientsResponse>(
    API_ENDPOINTS.getPatients,
    0,
    queryParams,
    !!accountId
  );

  const { 
    mutate: addPatient, 
    loading: addingPatient, 
    error: addPatientError 
  } = useMutation<AddPatientResponse, { accountId: string; patientName: string; relationship: string }>(
    API_ENDPOINTS.addPatient,
    "post"
  );

  const { 
    mutate: deletePatient, 
    loading: deletingPatient, 
    error: deletePatientError 
  } = useMutation<{ success: boolean; message: string }, { accountId: string; patientId: string }>(
    API_ENDPOINTS.deletePatient,
    "delete"
  );

  const patients = useMemo(() => data?.patients || [], [data?.patients]);

  const handleAddPatient = async (patientName: string, relationship: string) => {
    if (!accountId) {
      throw new Error("Account ID is required");
    }
    
    const result = await addPatient({
      accountId,
      patientName,
      relationship,
    });
    
    if (result?.success) {
      refetch();
    }
    
    return result;
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!accountId) {
      throw new Error("Account ID is required");
    }
    
    const result = await deletePatient({
      accountId,
      patientId,
    });
    
    if (result?.success) {
      refetch();
    }
    
    return result;
  };

  return {
    patients,
    loadingPatients: loading,
    addPatient: handleAddPatient,
    addingPatient,
    addPatientError,
    deletePatient: handleDeletePatient,
    deletingPatient,
    deletePatientError,
  };
};

