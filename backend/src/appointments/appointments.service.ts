import { allAsync, runAsync, getAsync } from "../db/dbHelpers";
import {GET_APPOINTMENT_HISTORY, GET_AVALIABLE_SLOTS_BY_DOCTOR_ID, GET_NEXT_AVAILABLE_APPOINTMENT_DATE, GET_UPCOMING_APPOINTMENTS, UPDATE_APPOINTMENT_ACCOUNT_ID, GET_ACCOUNT_BY_ID, GET_APPOINTMENT_BY_ID, GET_PATIENTS_BY_ACCOUNT_ID} from "../db/queries";
import { Appointment, AvailableSlot } from "../types/types";
import { getCurrentDateTime } from "../utils/dateUtils";



export async function getAccountAppointments(accountID: string) {
  const { today, currentTime } = getCurrentDateTime();

  const upcomingAppointment = await allAsync<Appointment>(
    GET_UPCOMING_APPOINTMENTS,
    [accountID, today, today, currentTime]
  );

  const appointmentHistory = await allAsync<Appointment>(
    GET_APPOINTMENT_HISTORY,
    [accountID, today, today, currentTime]
  );

  const account = await getAsync<{ id: string; phone: string; name: string | null }>(GET_ACCOUNT_BY_ID, [accountID]);

  return { appointmentHistory, upcomingAppointment, accountName: account?.name || null };
}

export async function getAvailableSlotsByDoctorId(doctorID: number) {
  const { today, currentTime } = getCurrentDateTime();
  return allAsync<AvailableSlot>(
    GET_AVALIABLE_SLOTS_BY_DOCTOR_ID,
    [doctorID, today, today, currentTime]
  );
}

export async function updateAppointmentAccountID(
  appointmentID: number, 
  accountID: string | null, 
  patientId: string | null = null, 
  patientName: string | null = null
) {
  await runAsync(UPDATE_APPOINTMENT_ACCOUNT_ID, [accountID, patientId, patientName, appointmentID]);
}

export async function rescheduleAppointment(
  oldAppointmentID: number, 
  newAppointmentID: number, 
  accountID: string,
  patientId: string | null = null,
  patientName: string | null = null
) {
  if (patientId === null && patientName === null) {
    const oldAppointment = await getAsync<{ patient_id: string | null; patient_name: string | null }>(
      GET_APPOINTMENT_BY_ID,
      [oldAppointmentID]
    );
    if (oldAppointment) {
      patientId = oldAppointment.patient_id;
      patientName = oldAppointment.patient_name;
    }
  }
  
  await updateAppointmentAccountID(oldAppointmentID, null, null, null);
  await updateAppointmentAccountID(newAppointmentID, accountID, patientId, patientName);
}

export async function getNextAvailableAppointmentDate(doctorID: number) {
  const { today, currentTime } = getCurrentDateTime();
  const results = await allAsync<Appointment>(
    GET_NEXT_AVAILABLE_APPOINTMENT_DATE,
    [doctorID, today, today, currentTime]
  );
  return results[0];
}
