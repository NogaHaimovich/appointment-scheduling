
import { allAsync, getAsync, runAsync } from "../../db/dbHelpers";
import { getPatientsByAccountId, addPatientToAccount, deletePatientById } from "../patients.service";
import { getCurrentDateTime } from "../../utils/dateUtils";
import { GET_PATIENTS_BY_ACCOUNT_ID, GET_NEXT_APPOINTMENT_BY_PATIENT_ID, ADD_PATIENT_TO_ACCOUNT, REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS, DELETE_PATIENT_BY_ID } from "../../db/queries";

jest.mock("../../db/dbHelpers", () => ({
  allAsync: jest.fn(),
  getAsync: jest.fn(),
  runAsync: jest.fn()
}));

jest.mock("../../utils/dateUtils", () => ({
  getCurrentDateTime: jest.fn()
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "generated-uuid")
}));

const mockPatients = [
    {
        id: "patient1",
        patient_name: "John Doe",
        relationship: "Self",
        account_id: "account1"
    },
    {
        id: "patient2",
        patient_name: "Jane Smith",
        relationship: "Self",
        account_id: "account2"
    },
    {
        id: "patient3",
        patient_name: "Jane Doe",
        relationship: "Spouse",
        account_id: "account1"
    },
    {
        id: "patient4",
        patient_name: "Jack Doe",
        relationship: "Child",
        account_id: "account1"
    },
    {
        id: "patient5",
        patient_name: "Jill Smith",
        relationship: "Sibling",
        account_id: "account2"
    }
];


const today = "2024-07-10";
const currentTime = "12:00";

describe("Patients Service tests", () => {
    beforeEach(() => {
        (getCurrentDateTime as jest.Mock).mockReturnValue({ today, currentTime });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all patient details by account id", async () => {
        const accountId = "account1";
        const account1Patients = mockPatients.filter(p => p.account_id === accountId);
        (allAsync as jest.Mock).mockResolvedValue(account1Patients);

        const mockNextAppointment = { doctor_name: "Dr. House", date: "2024-07-15", time: "14:00" };
        (getAsync as jest.Mock)
            .mockResolvedValueOnce(mockNextAppointment)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);

        const patients = await getPatientsByAccountId(accountId);

        expect(allAsync).toHaveBeenCalledWith(GET_PATIENTS_BY_ACCOUNT_ID, [accountId]);
        expect(getAsync).toHaveBeenCalledTimes(account1Patients.length);
        account1Patients.forEach((patient) => {
            expect(getAsync).toHaveBeenCalledWith(
                GET_NEXT_APPOINTMENT_BY_PATIENT_ID,
                [patient.id, today, today, currentTime]
            );
        });

        expect(patients).toHaveLength(3);
        expect(patients[0]).toEqual({
            ...account1Patients[0],
            nextAppointment: {
                doctorName: "Dr. House",
                date: "2024-07-15",
                time: "14:00",
            },
        });
        expect(patients[1]).toEqual(account1Patients[1]);
        expect(patients[2]).toEqual(account1Patients[2]);
    });

    it("should add a patient to account", async () => {
        const accountId = "account1";
        const patientName = "New Patient";
        const relationship = "Sibling";

        (runAsync as jest.Mock).mockResolvedValue({ changes: 1 });

        const patientId = await addPatientToAccount(accountId, patientName, relationship);

        expect(runAsync).toHaveBeenCalledWith(ADD_PATIENT_TO_ACCOUNT, [accountId, patientName, "generated-uuid", relationship]);
        expect(patientId).toBe("generated-uuid");
    });

    it("should delete a patient by id", async () => {
        const accountId = "account1";
        const patientId = "patient3";

        (runAsync as jest.Mock)
            .mockResolvedValueOnce(undefined)          
            .mockResolvedValueOnce(undefined)         
            .mockResolvedValueOnce({ changes: 1 });   

        await deletePatientById(accountId, patientId);

        expect(runAsync).toHaveBeenNthCalledWith(1, "BEGIN TRANSACTION");
        expect(runAsync).toHaveBeenNthCalledWith(2, REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS , [patientId, accountId, today, today, currentTime]);
        expect(runAsync).toHaveBeenNthCalledWith(3, DELETE_PATIENT_BY_ID, [patientId, accountId]);
        expect(runAsync).toHaveBeenNthCalledWith(4, "COMMIT");

    });

    it("should rollback and throw when patient is not found", async () => {
        const accountId = "account1";
        const patientId = "non-existent";

        (runAsync as jest.Mock)
            .mockResolvedValueOnce(undefined)          
            .mockResolvedValueOnce(undefined)          
            .mockResolvedValueOnce({ changes: 0 });   

        await expect(deletePatientById(accountId, patientId)).rejects.toThrow("PATIENT_NOT_FOUND_OR_CANNOT_DELETE");

        expect(runAsync).toHaveBeenNthCalledWith(1, "BEGIN TRANSACTION");
        expect(runAsync).toHaveBeenNthCalledWith(2, REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS, [patientId, accountId, today, today, currentTime]);
        expect(runAsync).toHaveBeenNthCalledWith(3, DELETE_PATIENT_BY_ID, [patientId, accountId]);
        expect(runAsync).toHaveBeenNthCalledWith(4, "ROLLBACK");
        expect(runAsync).not.toHaveBeenCalledWith("COMMIT");
    });

    it("should rollback and throw on db error during delete", async () => {
        const accountId = "account1";
        const patientId = "patient3";
        const dbError = new Error("DB_ERROR");

        (runAsync as jest.Mock)
            .mockResolvedValueOnce(undefined)          
            .mockRejectedValueOnce(dbError);           

        await expect(deletePatientById(accountId, patientId)).rejects.toThrow("DB_ERROR");

        expect(runAsync).toHaveBeenNthCalledWith(1, "BEGIN TRANSACTION");
        expect(runAsync).toHaveBeenNthCalledWith(2, REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS, [patientId, accountId, today, today, currentTime]);
        expect(runAsync).toHaveBeenNthCalledWith(3, "ROLLBACK");
        expect(runAsync).not.toHaveBeenCalledWith("COMMIT");
    });
});