import { useMemo, useState } from "react";
import type { SlotsResponse } from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { useData } from "./useData";

export const useSlots = (doctorId: number | null) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const queryParams = useMemo(
    () => (doctorId ? { doctorId } : undefined),
    [doctorId]
  );

  const { data, loading } =
    useData<SlotsResponse>(
      API_ENDPOINTS.getAvailableSlots,
      0,
      queryParams,
      !!doctorId
    );

  const groupedSlots = useMemo(() => {
    if (!data) return {};
    return data.availableSlots.reduce((acc: Record<string, string[]>, slot) => {
      acc[slot.date] = acc[slot.date] || [];
      acc[slot.date].push(slot.time);
      return acc;
    }, {});
  }, [data]);

  const selectedAppointmentId = useMemo(() => {
    if (!data) return null;
    return (
      data.availableSlots.find(
        s => s.date === selectedDate && s.time === selectedTime
      )?.id ?? null
    );
  }, [data, selectedDate, selectedTime]);

  return {
    selectedDate,
    selectedTime,
    setSelectedDate,
    setSelectedTime,
    groupedSlots,
    selectedAppointmentId,
    loadingSlots: loading,
    resetSlots: () => {
      setSelectedDate("");
      setSelectedTime("");
    },
  };
};
