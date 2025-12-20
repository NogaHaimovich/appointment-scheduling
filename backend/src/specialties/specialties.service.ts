import { allAsync } from "../db/dbHelpers";
import { GET_SPECIALTIES_LIST, GET_DOCTORS_LIST_BY_SPECIALTY } from "../db/queries";
import { Specialty, Doctor } from "../types/types";



export async function getAllSpecialties() {
  return allAsync<Specialty>(GET_SPECIALTIES_LIST);
}

export async function getDoctorsBySpecialty(specialtyId: number) {
  return allAsync<Doctor>(GET_DOCTORS_LIST_BY_SPECIALTY, [specialtyId]);
}
