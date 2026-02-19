import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getPatientsByAccountIdHandler, addPatientToAccountHandler, deletePatientByIdHandler } from "../patients.controller";
import { getPatientsByAccountId, addPatientToAccount, deletePatientById } from "../patients.service";

jest.mock("../patients.service");
const mockedGetPatientsByAccountId = getPatientsByAccountId as jest.MockedFunction<typeof getPatientsByAccountId>;
const mockedAddPatientToAccount = addPatientToAccount as jest.MockedFunction<typeof addPatientToAccount>;
const mockedDeletePatientById = deletePatientById as jest.MockedFunction<typeof deletePatientById>;

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;
}

function mockAuthReq(overrides: { accountId?: string | null; body?: Record<string, unknown> }): AuthRequest {
    return overrides as unknown as AuthRequest;
}

describe("getPatientsByAccountIdHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if accountId is missing", async () => {
        const req = mockAuthReq({ accountId: null });
        const res = mockRes();

        await getPatientsByAccountIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authentication required"
        });
    });

    it("should return patients list on success", async () => {
        const mockPatients = [
            { id: "p1", name: "John", account_id: "acc1", relationship: "self" },
            { id: "p2", name: "Jane", account_id: "acc1", relationship: "spouse" }
        ];
        mockedGetPatientsByAccountId.mockResolvedValue(mockPatients);

        const req = mockAuthReq({ accountId: "acc1" });
        const res = mockRes();

        await getPatientsByAccountIdHandler(req, res);

        expect(mockedGetPatientsByAccountId).toHaveBeenCalledWith("acc1");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            patients: mockPatients
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedGetPatientsByAccountId.mockRejectedValue(new Error("Database error"));

        const req = mockAuthReq({ accountId: "acc1" });
        const res = mockRes();

        await getPatientsByAccountIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to retrieve patients"
        });
    });
});

describe("addPatientToAccountHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if accountId is missing", async () => {
        const req = mockAuthReq({ accountId: null, body: { patientName: "John", relationship: "self" } });
        const res = mockRes();

        await addPatientToAccountHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authentication required"
        });
    });

    it("should return 400 if patientName is missing", async () => {
        const req = mockAuthReq({ accountId: "acc1", body: { relationship: "self" } });
        const res = mockRes();

        await addPatientToAccountHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Patient name is required"
        });
    });

    it("should return 400 if relationship is missing", async () => {
        const req = mockAuthReq({ accountId: "acc1", body: { patientName: "John" } });
        const res = mockRes();

        await addPatientToAccountHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Relationship is required"
        });
    });

    it("should add patient successfully", async () => {
        mockedAddPatientToAccount.mockResolvedValue("p-new");

        const req = mockAuthReq({ accountId: "acc1", body: { patientName: "John", relationship: "child" } });
        const res = mockRes();

        await addPatientToAccountHandler(req, res);

        expect(mockedAddPatientToAccount).toHaveBeenCalledWith("acc1", "John", "child");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Patient added successfully"
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedAddPatientToAccount.mockRejectedValue(new Error("Database error"));

        const req = mockAuthReq({ accountId: "acc1", body: { patientName: "John", relationship: "child" } });
        const res = mockRes();

        await addPatientToAccountHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to add patient"
        });
    });
});

describe("deletePatientByIdHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if accountId is missing", async () => {
        const req = mockAuthReq({ accountId: null, body: { patientId: "p1" } });
        const res = mockRes();

        await deletePatientByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authentication required"
        });
    });

    it("should return 400 if patientId is missing", async () => {
        const req = mockAuthReq({ accountId: "acc1", body: {} });
        const res = mockRes();

        await deletePatientByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Patient ID is required"
        });
    });

    it("should delete patient successfully", async () => {
        mockedDeletePatientById.mockResolvedValue(undefined);

        const req = mockAuthReq({ accountId: "acc1", body: { patientId: "p1" } });
        const res = mockRes();

        await deletePatientByIdHandler(req, res);

        expect(mockedDeletePatientById).toHaveBeenCalledWith("acc1", "p1");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Patient deleted successfully"
        });
    });

    it("should return 500 with error message if there is an error", async () => {
        mockedDeletePatientById.mockRejectedValue(new Error("PATIENT_NOT_FOUND_OR_CANNOT_DELETE"));

        const req = mockAuthReq({ accountId: "acc1", body: { patientId: "p1" } });
        const res = mockRes();

        await deletePatientByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "PATIENT_NOT_FOUND_OR_CANNOT_DELETE"
        });
    });
});
