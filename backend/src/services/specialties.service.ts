import { allAsync } from "../db/dbHelpers";
import { GET_DOCTORS_LIST_BY_SPECIALTY, GET_SPECIALTIES_LIST} from "../db/queris";
import { Doctor, Specialty } from "../types/types";


export async function getAllSpecialties() {
  return allAsync<Specialty>(GET_SPECIALTIES_LIST);
}

export async function getDoctorsBySpecialty(specialtyId: number) {
  return allAsync<Doctor>(GET_DOCTORS_LIST_BY_SPECIALTY, [specialtyId]);
}
