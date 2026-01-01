export interface AppointmentProps  {
  id: number;
  doctor_id: number;
  date: string;
  time: string;
  doctor_name: string;
  specialty_name: string;
}

export type Specialty ={
  id: number;
  name: string;
  description: string;
}

export type Doctor = {
  id: number;
  name: string;
};

export type DropdownOption = {
  value: string;
  label: string;
  description?: string;
}

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
} & T;

export type ApiMessageResponse = ApiResponse<{
  message: string;
}>;

export type SpecialitiesResponse = ApiResponse<{
  specialties: Specialty[];
}>

export type AppointmentsResponse = ApiResponse<{
  appointmentHistory: AppointmentProps[];
  upcomingAppointment: AppointmentProps[];
}>;

export type DoctorBySpecialtyResponse = ApiResponse<{
  doctors: Doctor[];
}>;

export type SlotsResponse = ApiResponse<{
  avaliableSlots: AppointmentProps[];
}>;

export type GetCodeResponse = ApiResponse<{
  message: string;
  code: string;
}>;

export type ValidateCodeResponse = ApiResponse<{
  message: string;
  token: string;
}>;

export type NextAvailableSlotResponse = ApiResponse<{
  nextAvailable: AppointmentProps | null;
}>;