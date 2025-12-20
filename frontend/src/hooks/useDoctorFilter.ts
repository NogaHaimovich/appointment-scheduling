import { useMemo, useState } from "react";
import type { AppointmentProps } from "../types/types";

export const useDoctorFilter = (appointments: AppointmentProps[]) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const doctors = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a) => {
      if (a.doctor_name) set.add(a.doctor_name);
    });
    return Array.from(set);
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (!selectedDoctor) return appointments;
    return appointments.filter(
      (a) => a.doctor_name === selectedDoctor
    );
  }, [appointments, selectedDoctor]);

  return {
    selectedDoctor,
    setSelectedDoctor,
    doctors,
    filteredAppointments,
  };
};
