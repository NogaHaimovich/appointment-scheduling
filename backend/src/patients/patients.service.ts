import { allAsync } from "../db/dbHelpers";
import { GET_PATIENTS_BY_ACCOUNT_ID } from "../db/queries";
import { Patient } from "../types/types";

export async function getPatientsByAccountId(accountId: string): Promise<Patient[]> {
  return allAsync<Patient>(GET_PATIENTS_BY_ACCOUNT_ID, [accountId]);
}

