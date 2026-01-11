import { randomUUID } from "crypto";
import { allAsync, runAsync, getAsync } from "../db/dbHelpers";
import { GET_PATIENTS_BY_ACCOUNT_ID, ADD_PATIENT_TO_ACCOUNT, DELETE_PATIENT_BY_ID, REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS, GET_NEXT_APPOINTMENT_BY_PATIENT_ID } from "../db/queries";
import { Patient } from "../types/types";
import { getCurrentDateTime } from "../utils/dateUtils";

export async function getPatientsByAccountId(accountId: string): Promise<Patient[]> {
  const patients = await allAsync<Patient>(GET_PATIENTS_BY_ACCOUNT_ID, [accountId]);
  const { today, currentTime } = getCurrentDateTime();

  const patientsWithNextAppointments = await Promise.all(
    patients.map(async (patient) => {
      const nextAppointment = await getAsync<{ doctor_name: string; date: string; time: string } | null>(
        GET_NEXT_APPOINTMENT_BY_PATIENT_ID,
        [patient.id, today, today, currentTime]
      );

      return {
        ...patient,
        ...(nextAppointment && {
          nextAppointment: {
            doctorName: nextAppointment.doctor_name,
            date: nextAppointment.date,
            time: nextAppointment.time,
          },
        }),
      };
    })
  );

  return patientsWithNextAppointments;
}

export async function addPatientToAccount(accountId: string, patientName: string, relationship: string): Promise<string> {
  const patientId = randomUUID();
  await runAsync(ADD_PATIENT_TO_ACCOUNT, [accountId, patientName, patientId, relationship]);

  return patientId;
}

export async function deletePatientById(accountId: string, patientId: string): Promise<void> {
  const { today, currentTime } = getCurrentDateTime();

  await runAsync("BEGIN TRANSACTION");

  try {
    await runAsync(REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS, [patientId, accountId, today, today, currentTime] );

    const result = await runAsync(DELETE_PATIENT_BY_ID,[patientId, accountId]);

    if (!result || result.changes === 0) {
      throw new Error("PATIENT_NOT_FOUND_OR_CANNOT_DELETE");
    }

    await runAsync("COMMIT");
  } catch (err) {
    await runAsync("ROLLBACK");
    throw err;
  }
}
