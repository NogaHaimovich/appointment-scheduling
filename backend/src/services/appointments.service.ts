import { allAsync, runAsync } from "../db/dbHelpers";
import {GET_APPOINTMENT_HISTORY, GET_AVALIABLE_SLOTS_BY_DOCTOR_ID, GET_UPCOMING_APPOINTMENTS, UPDATE_APPOINTMENT_USER_ID} from "../db/queris";
import { Appointment, AvailableSlot } from "../types/types";



export async function getUserAppointments(userID: string) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const upcomingAppointment = await allAsync<Appointment>(
    GET_UPCOMING_APPOINTMENTS,
    [userID, today, today, currentTime]
  );

  const appointmentHistory = await allAsync<Appointment>(
    GET_APPOINTMENT_HISTORY,
    [userID, today, today, currentTime]
  );

  return { appointmentHistory, upcomingAppointment };
}

export async function getAvailableSlotsByDoctorId(doctorID: number) {
  return allAsync<AvailableSlot>(
    GET_AVALIABLE_SLOTS_BY_DOCTOR_ID,
    [doctorID]
  );
}

export async function updateAppointmentUserID(appointmentID: number, userID: string | null) {
  await runAsync(UPDATE_APPOINTMENT_USER_ID, [userID, appointmentID]);
}

export async function rescheduleAppointment(oldAppointmentID: number, newAppointmentID: number, userID: string) {
  await updateAppointmentUserID(oldAppointmentID, null);
  await updateAppointmentUserID(newAppointmentID, userID);
}
