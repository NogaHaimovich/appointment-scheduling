import { useState, useMemo, useCallback, useEffect } from "react";
import type {SpecialitiesResponse, DoctorBySpecialtyResponse, SlotsResponse, ApiMessageResponse} from "../types/types";
import { API_ENDPOINTS } from "../config/api";
import { authUtils } from "../utils/auth";
import { formatDateToDisplay } from "../utils/dateFormat";
import { useData } from "./useData";
import { useMutation } from "./useMutation";
import { useNavigate, useSearchParams } from "react-router-dom";


type RescheduleParams = {
  appointmentId: string;
  specialty?: string;
  doctor?: string;
} | null;

export const useAppointmentBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const rescheduleParams: RescheduleParams = useMemo(() => {
    const appointmentId = searchParams.get("appointmentId");
    const specialty = searchParams.get("specialty");
    const doctor = searchParams.get("doctor");

    
    if (appointmentId) {
      return { 
        appointmentId, 
        specialty: specialty || undefined, 
        doctor: doctor || undefined, 
      };
    }
    return null;
  }, [searchParams]);
  
  const isRescheduleMode = !!rescheduleParams;
  const oldAppointmentId = rescheduleParams ? parseInt(rescheduleParams.appointmentId) : null;
  
  const [selectedSpecialty, setSelectedSpecialty] = useState(rescheduleParams?.specialty || "");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState(rescheduleParams?.doctor || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const { data: specialties, loading: loadingSpecialties } =
    useData<SpecialitiesResponse>(API_ENDPOINTS.getSpecialties, 0);

  useEffect(() => {
    if (isRescheduleMode && selectedSpecialty && specialties?.specialties) {
      const specialty = specialties.specialties.find(s => s.name === selectedSpecialty);
      if (specialty) {
        setSelectedSpecialtyId(specialty.id);
      }
    }
  }, [isRescheduleMode, selectedSpecialty, specialties]);

  const doctorsQueryParams = useMemo(
    () => (selectedSpecialtyId ? { specialtyId: selectedSpecialtyId } : undefined),
    [selectedSpecialtyId]
  );

  const { data: doctors, loading: loadingDoctors } =
    useData<DoctorBySpecialtyResponse>(
      API_ENDPOINTS.getDoctorsBySpecialty,
      0,
      doctorsQueryParams,
      !!selectedSpecialtyId || isRescheduleMode
    );

  useEffect(() => {
    if (isRescheduleMode && selectedDoctor && doctors?.doctors) {
      const doctor = doctors.doctors.find(d => d.name === selectedDoctor);
      if (doctor) {
        setSelectedDoctorId(doctor.id);
      }
    }
  }, [isRescheduleMode, selectedDoctor, doctors]);

  const slotsQueryParams = useMemo(
    () => (selectedDoctorId ? { doctorId: selectedDoctorId } : undefined),
    [selectedDoctorId]
  );

  const { data: slots, loading: loadingSlots } =
    useData<SlotsResponse>(
      API_ENDPOINTS.getAvailableSlots,
      0,
      slotsQueryParams,
      !!selectedDoctorId
    );

  const specialtyOptions = useMemo(
    () => specialties?.specialties?.map(s => ({
      value: s.name,
      label: s.name,
      description: s.description
    })) || [],
    [specialties?.specialties]
  );

  const doctorsOptions = useMemo(
    () => doctors?.doctors?.map(d => d.name) || [],
    [doctors?.doctors]
  );

  const groupedSlots = useMemo(() => {
    if (!slots) return {};
    return slots.avaliableSlots.reduce((acc: Record<string, string[]>, slot) => {
      acc[slot.date] = acc[slot.date] || [];
      acc[slot.date].push(slot.time);
      return acc;
    }, {});
  }, [slots]);

  const isFormComplete = !!(
    selectedSpecialty &&
    selectedDoctor &&
    selectedDate &&
    selectedTime
  );

  const selectedAppointmentId = useMemo(() => {
    if (!slots) return null;
    return slots.avaliableSlots.find(
      s => s.date === selectedDate && s.time === selectedTime
    )?.id ?? null;
  }, [slots, selectedDate, selectedTime]);

  const handleSpecialtyChange = useCallback(
    (name: string) => {
      setSelectedSpecialty(name);
      setSelectedDoctor("");
      setSelectedDoctorId(null);
      setSelectedDate("");
      setSelectedTime("");
      const specialty = specialties?.specialties?.find(s => s.name === name);
      setSelectedSpecialtyId(specialty?.id ?? null);
    },
    [specialties?.specialties]
  );

  const handleDoctorChange = useCallback(
    (name: string) => {
      setSelectedDoctor(name);
      setSelectedDate("");
      setSelectedTime("");
      const doctor = doctors?.doctors?.find(d => d.name === name);
      setSelectedDoctorId(doctor?.id ?? null);
    },
    [doctors?.doctors]
  );

  const { mutate: scheduleAppointment, loading: scheduling, error } =
    useMutation<ApiMessageResponse, { userId: string; appointmentId: number }>(
      "/appointments/assign",
      "patch"
    );

  const { mutate: rescheduleAppointment, loading: rescheduling } =
    useMutation<ApiMessageResponse, { oldAppointmentId: number; newAppointmentId: number; userId: string }>(
      "/appointments/reschedule",
      "patch"
    );

  const handleSchedule = useCallback(async () => {
    setLocalError(null);

    const userId = authUtils.getUserIdFromToken();
    if (!userId) {
      setLocalError("User not authenticated. Please log in again.");
      return;
    }

    if (!selectedAppointmentId) {
      setLocalError("No appointment selected. Please select a date and time.");
      return;
    }

    if (isRescheduleMode && oldAppointmentId) {
      const formattedDate = formatDateToDisplay(selectedDate);
      const confirmMessage = `Are you sure you want to reschedule your appointment to ${formattedDate} at ${selectedTime}?`;
      const confirmed = window.confirm(confirmMessage);
      
      if (!confirmed) {
        return;
      }
    }

    try {
      let response;
      
      if (isRescheduleMode && oldAppointmentId) {
        response = await rescheduleAppointment({ 
          oldAppointmentId, 
          newAppointmentId: selectedAppointmentId, 
          userId 
        });
      } else {
        response = await scheduleAppointment({ userId, appointmentId: selectedAppointmentId });
      }

      if ((response as any)?.success) {
        setLocalError(null);
        setShowSuccessPopup(true);
      } else {
        setLocalError((response as any)?.message || `Failed to ${isRescheduleMode ? 'reschedule' : 'schedule'} appointment.`);
      }
    } catch (err) {
      console.error(`Failed to ${isRescheduleMode ? 'reschedule' : 'schedule'} appointment:`, err);
      setLocalError(
        (err as any)?.response?.data?.message || `Failed to ${isRescheduleMode ? 'reschedule' : 'schedule'} appointment. Please try again.`
      );
    }
  }, [selectedAppointmentId, selectedDate, selectedTime, scheduleAppointment, rescheduleAppointment, navigate, isRescheduleMode, oldAppointmentId]);

  const handleCloseSuccessPopup = useCallback(() => {
    setShowSuccessPopup(false);
    setSelectedSpecialty("");
    setSelectedSpecialtyId(null);
    setSelectedDoctor("");
    setSelectedDoctorId(null);
    setSelectedDate("");
    setSelectedTime("");
    setLocalError(null);
    navigate("/dashboard");
  }, [navigate]);

  return {
    selectedSpecialty,
    selectedDoctor,
    selectedDate,
    selectedTime,

    specialtyOptions,
    doctorsOptions,
    groupedSlots,

    loadingSpecialties,
    loadingDoctors,
    loadingSlots,
    scheduling: scheduling || rescheduling,

    isFormComplete,
    isRescheduleMode,

    handleSpecialtyChange,
    handleDoctorChange,
    setSelectedDate,
    setSelectedTime,
    handleSchedule,

    error: error || localError,
    selectedSpecialtyId,
    selectedDoctorId,
    showSuccessPopup,
    handleCloseSuccessPopup,
  };
};
