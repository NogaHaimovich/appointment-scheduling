import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "../utils/auth";
import { formatDateToDisplay, formatTimeToDisplay } from "../utils/dateFormat";
import { useMutation } from "./useMutation";
import type { ApiMessageResponse } from "../types/types";

import { useRescheduleParams } from "./useRescheduleParams";
import { useSpecialties } from "./useSpecialties";
import { useDoctors } from "./useDoctors";
import { useSlots } from "./useSlots";
import { useNextAvailableSlots } from "./useNextAvailableSlots";

export const useAppointmentBooking = () => {
  const navigate = useNavigate();
  const { rescheduleParams, isRescheduleMode } = useRescheduleParams();

  const {selectedSpecialty, selectedSpecialtyId, specialties,  loadingSpecialties,  handleSpecialtyChange,  resetSpecialty} = 
    useSpecialties(rescheduleParams?.specialty);

  const {selectedDoctor, selectedDoctorId, doctors, loadingDoctors, handleDoctorChange, resetDoctor} = 
    useDoctors( selectedSpecialtyId,  rescheduleParams?.doctor, true);

  const { getNextAvailableSlot, loadingNextAvailableSlots } = useNextAvailableSlots(doctors);

  const {selectedDate,  selectedTime, setSelectedDate, setSelectedTime, groupedSlots, selectedAppointmentId, loadingSlots, resetSlots} =
    useSlots(selectedDoctorId);

  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const isFormComplete = useMemo(
    () => !!(selectedSpecialty && selectedDoctor && selectedDate && selectedTime),
    [selectedSpecialty, selectedDoctor, selectedDate, selectedTime]
  );

  const { mutate: scheduleAppointment, loading: scheduling } =
    useMutation<ApiMessageResponse, { accountId: string; appointmentId: number }>( "/appointments/assign", "patch");

  const { mutate: rescheduleAppointment, loading: rescheduling } =
    useMutation<ApiMessageResponse, { oldAppointmentId: number; newAppointmentId: number; accountId: string }>( "/appointments/reschedule", "patch");

  const handleSchedule = useCallback(async () => {
    setLocalError(null);

    const accountId = authUtils.getAccountIdFromToken();
    if (!accountId || !selectedAppointmentId) {
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

    const response = isRescheduleMode && rescheduleParams
      ? await rescheduleAppointment({
          oldAppointmentId: rescheduleParams.appointmentId,
          newAppointmentId: selectedAppointmentId,
          accountId,
        })
      : await scheduleAppointment({ accountId, appointmentId: selectedAppointmentId });

    if ((response as any)?.success) {
      setShowSuccessPopup(true);
    } else {
      setLocalError((response as any)?.message || "Operation failed.");
    }
  }, [
    selectedAppointmentId,
    selectedDate,
    selectedTime,
    isRescheduleMode,
    rescheduleParams,
    scheduleAppointment,
    rescheduleAppointment,
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

    specialties,
    doctors,
    groupedSlots,

    loadingSpecialties,
    loadingDoctors,
    loadingSlots,
    loadingNextAvailableSlots,
    scheduling: scheduling || rescheduling,

    isFormComplete,
    isRescheduleMode,

    handleSpecialtyChange,
    handleDoctorChange,
    setSelectedDate,
    setSelectedTime,
    handleSchedule,
    getNextAvailableSlot,

    error: localError,
    showSuccessPopup,
    handleCloseSuccessPopup,
  };
};
