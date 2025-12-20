export const API_BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  getCode: "/getCode",
  validateCode: "/validateCode",
  getUserAppointments: "/appointments/user",
  getSpecialties: "/specialties/",
  getDoctorsBySpecialty: "/specialties/doctors-by-specialty",
  getAvailableSlots: "/appointments/open-slots-by-doctor-id"
} as const;

