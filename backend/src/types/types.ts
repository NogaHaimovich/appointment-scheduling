export type Specialty = {
  id: number;
  specialty_name: string;
  description: string;
};

export type Doctor = {
  id: number;
  name: string;
};

export type Appointment = {
  id: number;
  doctor_id: number;
  date: string;
  time: string;
  doctor_name: string;
  specialty_name: string;
  patient_id: string | null;
  patient_name: string | null;
};

export type Patient = {
  id: string;
  patient_name: string;
  relationship: string;
};

export type AvailableSlot = {
  id: number;
  date: string;
  time: string;
};




