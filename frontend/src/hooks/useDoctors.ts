import { useEffect, useState, useCallback, useMemo } from "react";
import type { DoctorBySpecialtyResponse } from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { useData } from "./useData";

export const useDoctors = (
  specialtyId: number | null,
  initialDoctor?: string,
  enabled = true
) => {
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  const queryParams = useMemo(
    () => (specialtyId ? { specialtyId } : undefined),
    [specialtyId]
  );

  const { data, loading } =
    useData<DoctorBySpecialtyResponse>(
      API_ENDPOINTS.getDoctorsBySpecialty,
      0,
      queryParams,
      enabled && !!specialtyId
    );

  useEffect(() => {
    if (selectedDoctor && data?.doctors) {
      const doctor = data.doctors.find(d => d.name === selectedDoctor);
      setSelectedDoctorId(doctor?.id ?? null);
    }
  }, [selectedDoctor, data]);

  const handleDoctorChange = useCallback((name: string) => {
    setSelectedDoctor(name);
    setSelectedDoctorId(null);
  }, []);

  const doctors = useMemo(() => data?.doctors || [], [data?.doctors]);

  return {
    selectedDoctor,
    selectedDoctorId,
    doctors,
    loadingDoctors: loading,
    handleDoctorChange,
    resetDoctor: () => {
      setSelectedDoctor("");
      setSelectedDoctorId(null);
    },
  };
};
