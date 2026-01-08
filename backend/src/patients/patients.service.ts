import { randomUUID } from "crypto";
import { allAsync, runAsync } from "../db/dbHelpers";
import { GET_PATIENTS_BY_ACCOUNT_ID, ADD_PATIENT_TO_ACCOUNT, DELETE_PATIENT_BY_ID } from "../db/queries";
import { Patient } from "../types/types";

export async function getPatientsByAccountId(accountId: string): Promise<Patient[]> {
  return allAsync<Patient>(GET_PATIENTS_BY_ACCOUNT_ID, [accountId]);
}

export async function addPatientToAccount(accountId: string, patientName: string, relationship: string): Promise<string> {
  const patientId = randomUUID();
  await runAsync(ADD_PATIENT_TO_ACCOUNT, [accountId, patientName, patientId, relationship]);

  return patientId;
}

export async function deletePatientById(accountId: string, patientId: string): Promise<void> {
  const result = await runAsync(DELETE_PATIENT_BY_ID, [patientId, accountId]);

  if (!result || result.changes === 0) {
    throw new Error("PATIENT_NOT_FOUND_OR_NOT_OWNED");
  }
}