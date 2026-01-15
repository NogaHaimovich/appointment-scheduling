import { useMemo } from "react";
import type { PatientsResponse, AddPatientResponse } from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { useData } from "./useData";
import { useMutation } from "./useMutation";
import { authUtils } from "../utils/auth";

export const usePatients = () => {
  const isAuthenticated = authUtils.isAuthenticated();

  const { data, loading, refetch } = useData<PatientsResponse>(
    API_ENDPOINTS.getPatients,
    0,
    undefined,
    isAuthenticated
  );

  const { 
    mutate: addPatient, 
    loading: addingPatient, 
    error: addPatientError 
  } = useMutation<AddPatientResponse, { patientName: string; relationship: string }>(
    API_ENDPOINTS.addPatient,
    "post"
  );

  const { 
    mutate: deletePatient, 
    loading: deletingPatient, 
    error: deletePatientError 
  } = useMutation<{ success: boolean; message: string }, { patientId: string }>(
    API_ENDPOINTS.deletePatient,
    "delete"
  );

  const patients = useMemo(() => data?.patients || [], [data?.patients]);

  const handleAddPatient = async (patientName: string, relationship: string) => {
    if (!isAuthenticated) {
      throw new Error("Authentication required");
    }
    
    const result = await addPatient({
      patientName,
      relationship,
    });
    
    if (result?.success) {
      refetch();
    }
    
    return result;
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!isAuthenticated) {
      throw new Error("Authentication required");
    }
    
    const result = await deletePatient({
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
    refetchPatients: refetch,
  };
};

