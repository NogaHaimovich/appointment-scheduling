import { useEffect, useMemo, useState, useCallback } from "react";
import type { SpecialitiesResponse } from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { useData } from "./useData";

export const useSpecialties = (initialSpecialty?: string) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty || "");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(null);

  const { data, loading } =
    useData<SpecialitiesResponse>(API_ENDPOINTS.getSpecialties, 0);

  useEffect(() => {
    if (selectedSpecialty && data?.specialties) {
      const specialty = data.specialties.find(s => s.name === selectedSpecialty);
      setSelectedSpecialtyId(specialty?.id ?? null);
    }
  }, [selectedSpecialty, data]);

  const specialtyOptions = useMemo(
    () =>
      data?.specialties?.map(s => ({
        value: s.name,
        label: s.name,
        description: s.description,
      })) || [],
    [data]
  );

  const handleSpecialtyChange = useCallback((name: string) => {
    setSelectedSpecialty(name);
    setSelectedSpecialtyId(null);
  }, []);

  return {
    selectedSpecialty,
    selectedSpecialtyId,
    specialtyOptions,
    loadingSpecialties: loading,
    handleSpecialtyChange,
    resetSpecialty: () => {
      setSelectedSpecialty("");
      setSelectedSpecialtyId(null);
    },
  };
};
