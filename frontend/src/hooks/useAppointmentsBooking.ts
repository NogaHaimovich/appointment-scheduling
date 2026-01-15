import { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authUtils } from "../utils/auth";
import { formatDateToDisplay, formatTimeToDisplay } from "../utils/dateFormat";
import { useMutation } from "./useMutation";
import type { ApiMessageResponse } from "../types/types";

import { useRescheduleParams } from "./useRescheduleParams";
import { useSpecialties } from "./useSpecialties";
import { useDoctors } from "./useDoctors";
import { useSlots } from "./useSlots";
import { useNextAvailableSlots } from "./useNextAvailableSlots";
import { usePatientsContext } from "../contexts/PatientsContext";
import { useAppointmentsContext } from "../contexts/AppointmentsContext";

export const useAppointmentBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rescheduleParams, isRescheduleMode } = useRescheduleParams();
  const { patients, loadingPatients } = usePatientsContext();
  const { refetchAppointments } = useAppointmentsContext();
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const {selectedSpecialty, selectedSpecialtyId, specialties,  loadingSpecialties,  handleSpecialtyChange,  resetSpecialty} = 
    useSpecialties(rescheduleParams?.specialty);

  const {selectedDoctor, selectedDoctorId, doctors, loadingDoctors, handleDoctorChange, resetDoctor} = 
    useDoctors( selectedSpecialtyId,  rescheduleParams?.doctor, true);

  const { getNextAvailableSlot, loadingNextAvailableSlots } = useNextAvailableSlots(doctors);

  const {selectedDate,  selectedTime, setSelectedDate, setSelectedTime, groupedSlots, selectedAppointmentId, loadingSlots, resetSlots} =
    useSlots(selectedDoctorId);

  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (patients.length > 0) {
      const patientIdFromUrl = searchParams.get("patientId");
      
      if (patientIdFromUrl) {
        const patient = patients.find(p => p.id === patientIdFromUrl);
        if (patient && selectedPatientId !== patient.id) {
          setSelectedPatientId(patient.id);
        }
      } else if (selectedPatientId === null) {
        const selfPatient = patients.find(p => p.relationship === 'self');
        if (selfPatient) {
          setSelectedPatientId(selfPatient.id);
        } else {
          setSelectedPatientId(patients[0].id);
        }
      }
    }
  }, [patients, selectedPatientId, searchParams]);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  const isFormComplete = useMemo(
    () => !!(selectedSpecialty && selectedDoctor && selectedDate && selectedTime && selectedPatientId),
    [selectedSpecialty, selectedDoctor, selectedDate, selectedTime, selectedPatientId]
  );

  const { mutate: scheduleAppointment, loading: scheduling } =
    useMutation<ApiMessageResponse, { appointmentId: number; patientId?: string | null; patientName?: string | null }>( "/appointments/assign", "patch");

  const { mutate: rescheduleAppointment, loading: rescheduling } =
    useMutation<ApiMessageResponse, { oldAppointmentId: number; newAppointmentId: number; patientId?: string | null; patientName?: string | null }>( "/appointments/reschedule", "patch");

  const handleSchedule = useCallback(async () => {
    setLocalError(null);

    if (!authUtils.isAuthenticated() || !selectedAppointmentId) {
      setLocalError("Please select a valid appointment.");
      return;
    }

    if (isRescheduleMode && rescheduleParams) {
      const formattedDate = formatDateToDisplay(selectedDate);
      const formattedTime = formatTimeToDisplay(selectedTime, selectedDate);
      const confirmed = window.confirm(
        `Reschedule to ${formattedDate} at ${formattedTime}?`
      );
      if (!confirmed) return;
    }

    const patientId = selectedPatientId;
    const patientName = selectedPatient?.patient_name || null;

    const response = isRescheduleMode && rescheduleParams
      ? await rescheduleAppointment({
          oldAppointmentId: rescheduleParams.appointmentId,
          newAppointmentId: selectedAppointmentId,
          patientId,
          patientName,
        })
      : await scheduleAppointment({ 
          appointmentId: selectedAppointmentId,
          patientId,
          patientName,
        });

    if (response?.success) {
      setShowSuccessPopup(true);
      // Refetch appointments to update the list immediately
      refetchAppointments();
    } else {
      setLocalError(response?.message || "Operation failed.");
    }
  }, [
    selectedAppointmentId,
    selectedDate,
    selectedTime,
    isRescheduleMode,
    rescheduleParams,
    scheduleAppointment,
    rescheduleAppointment,
    refetchAppointments,
    selectedPatientId,
    selectedPatient,
  ]);

  const handleCloseSuccessPopup = useCallback(() => {
    setShowSuccessPopup(false);
    setLocalError(null);
    resetSpecialty();
    resetDoctor();
    resetSlots();
    navigate("/dashboard");
  }, [navigate, resetSpecialty, resetDoctor, resetSlots]);

  return {
    selectedSpecialty,
    selectedDoctor,
    selectedDate,
    selectedTime,
    selectedPatientId,
    selectedPatient,

    specialties,
    doctors,
    patients,
    groupedSlots,

    loadingSpecialties,
    loadingDoctors,
    loadingPatients,
    loadingSlots,
    loadingNextAvailableSlots,
    scheduling: scheduling || rescheduling,

    isFormComplete,
    isRescheduleMode,

    handleSpecialtyChange,
    handleDoctorChange,
    setSelectedPatientId,
    setSelectedDate,
    setSelectedTime,
    handleSchedule,
    getNextAvailableSlot,

    error: localError,
    showSuccessPopup,
    handleCloseSuccessPopup,
  };
};
