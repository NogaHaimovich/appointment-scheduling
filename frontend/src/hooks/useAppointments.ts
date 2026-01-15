import { useMemo } from "react";
import type { AppointmentsResponse } from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { useData } from "./useData";
import { authUtils } from "../utils/auth";

export const useAppointments = () => {
  const isAuthenticated = authUtils.isAuthenticated();

  const { data, loading, error, refetch } = useData<AppointmentsResponse>(
    API_ENDPOINTS.getAccountAppointments,
    0,
    undefined, 
    isAuthenticated
  );

  const upcomingAppointments = useMemo(
    () => data?.upcomingAppointment || [],
    [data?.upcomingAppointment]
  );

  const pastAppointments = useMemo(
    () => data?.appointmentHistory || [],
    [data?.appointmentHistory]
  );

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments]
  );

  const accountName = useMemo(() => data?.accountName || null, [data?.accountName]);

  return {
    upcomingAppointments,
    pastAppointments,
    allAppointments,
    accountName,
    loadingAppointments: loading,
    error,
    refetchAppointments: refetch,
  };
};

