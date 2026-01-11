import { randomUUID } from "crypto";
import { allAsync, runAsync } from "../db/dbHelpers";
import { GET_PATIENTS_BY_ACCOUNT_ID, ADD_PATIENT_TO_ACCOUNT, DELETE_PATIENT_BY_ID, GET_UPCOMING_APPOINTMENTS_BY_PATIENT_ID, REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS } from "../db/queries";
import { Patient } from "../types/types";
import { getCurrentDateTime } from "../utils/dateUtils";

export async function getPatientsByAccountId(accountId: string): Promise<Patient[]> {
  return allAsync<Patient>(GET_PATIENTS_BY_ACCOUNT_ID, [accountId]);
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
