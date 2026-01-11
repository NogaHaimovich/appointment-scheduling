import { useMemo, useState } from "react";
import type { AppointmentProps } from "../types/types";

export const useAppointmentFilters = (appointments: AppointmentProps[]) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const doctors = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a) => {
      if (a.doctor_name) set.add(a.doctor_name);
    });
    return Array.from(set);
  }, [appointments]);

  const patients = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a) => {
      if (a.patient_name) set.add(a.patient_name);
    });
    return Array.from(set);
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const doctorMatch =
        !selectedDoctor || a.doctor_name === selectedDoctor;

      const patientMatch =
        !selectedPatient || a.patient_name === selectedPatient;

      return doctorMatch && patientMatch;
    });
  }, [appointments, selectedDoctor, selectedPatient]);

  return {
    selectedDoctor,
    setSelectedDoctor,
    selectedPatient,
    setSelectedPatient,
    doctors,
    patients,
    filteredAppointments,
  };
};
