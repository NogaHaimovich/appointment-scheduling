import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getAccountAppointmentsHandler, getAvailableSlotsByDoctorIdHandler, assignAppointmentHandler, rescheduleAppointmentHandler, getNextAvailableAppointmentHandler, getLastAppointmentBySpecialtyHandler } from "../appointments.controller";
import { getAccountAppointments, getAvailableSlotsByDoctorId, updateAppointmentAccountID, rescheduleAppointment, getNextAvailableAppointmentDate, getLastVisitPerSpecialty } from "../appointments.service";
import { Appointment, AvailableSlot } from "../../types/types";

jest.mock("../appointments.service");
const mockedGetAccountAppointments = getAccountAppointments as jest.MockedFunction<typeof getAccountAppointments>;
const mockedGetAvailableSlotsByDoctorId = getAvailableSlotsByDoctorId as jest.MockedFunction<typeof getAvailableSlotsByDoctorId>;
const mockedUpdateAppointmentAccountID = updateAppointmentAccountID as jest.MockedFunction<typeof updateAppointmentAccountID>;
const mockedRescheduleAppointment = rescheduleAppointment as jest.MockedFunction<typeof rescheduleAppointment>;
const mockedGetNextAvailableAppointmentDate = getNextAvailableAppointmentDate as jest.MockedFunction<typeof getNextAvailableAppointmentDate>;
const mockedGetLastVisitPerSpecialty = getLastVisitPerSpecialty as jest.MockedFunction<typeof getLastVisitPerSpecialty>;

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;
}

function mockAuthReq(overrides: { accountId?: string | null; body?: Record<string, unknown> }): AuthRequest {
    return overrides as unknown as AuthRequest;
}

function mockReq(overrides: { query: Record<string, string> }): Request {
    return overrides as unknown as Request;
}

const mockAppointment: Appointment = {
    id: 1, doctor_id: 1, date: "2024-07-01", time: "10:00",
    doctor_name: "Dr. Smith", specialty_name: "Cardiology",
    patient_id: null, patient_name: null
};

describe("getAccountAppointmentsHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if accountId is missing", async () => {
        const req = mockAuthReq({ accountId: null });
        const res = mockRes();

        await getAccountAppointmentsHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authentication required"
        });
    });

    it("should return available appointments for a valid accountId", async () => {
        const mockData = {
            appointmentHistory: [{ ...mockAppointment, id: 1 }],
            upcomingAppointment: [{ ...mockAppointment, id: 2, doctor_name: "Dr. Jones" }],
            accountName: "John Doe"
        };
        mockedGetAccountAppointments.mockResolvedValue(mockData);

        const req = mockAuthReq({ accountId: "1" });
        const res = mockRes();

        await getAccountAppointmentsHandler(req, res);

        expect(mockedGetAccountAppointments).toHaveBeenCalledWith("1");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            ...mockData
        });
    });

    it("should return 500 if there is an error retrieving appointments", async () => {
        mockedGetAccountAppointments.mockRejectedValue(new Error("Database error"));
        const req = mockAuthReq({ accountId: "1" });
        const res = mockRes();
        await getAccountAppointmentsHandler(req, res);

        expect(mockedGetAccountAppointments).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to retrieve appointments"
        });
    })
});

describe("getAvailableSlotsByDoctorIdHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if doctorId is missing", async () => {
        const req = mockReq({ query: {} });
        const res = mockRes();
        await getAvailableSlotsByDoctorIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Doctor ID is required"
        });
    });

    it("should return available slots for a valid doctorId", async () => {
        const doctorId = 1;
        const mockSlots: AvailableSlot[] = [
            { id: 1, date: "2024-07-01", time: "10:00" },
            { id: 2, date: "2024-07-01", time: "11:00" }
        ];
        mockedGetAvailableSlotsByDoctorId.mockResolvedValue(mockSlots);

        const req = mockReq({ query: { doctorId: doctorId.toString() } });
        const res = mockRes();
        await getAvailableSlotsByDoctorIdHandler(req, res);

        expect(mockedGetAvailableSlotsByDoctorId).toHaveBeenCalledWith(doctorId);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            availableSlots: mockSlots
        });
    });

    it("should return 500 if there is an error retrieving available slots", async () => {
        mockedGetAvailableSlotsByDoctorId.mockRejectedValue(new Error("Database error"));
        const req = mockReq({ query: { doctorId: "1" } });
        const res = mockRes();
        await getAvailableSlotsByDoctorIdHandler(req, res);

        expect(mockedGetAvailableSlotsByDoctorId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to retrieve appointments"
        });
    });
});

describe("assignAppointmentHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if accountId is missing", async () => {
        const req = mockAuthReq({ accountId: null, body: { appointmentId: 1 } });
        const res = mockRes();

        await assignAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authentication required"
        });
    });

    it("should return 400 if appointmentId is missing", async () => {
        const req = mockAuthReq({ accountId: "acc1", body: {} });
        const res = mockRes();

        await assignAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Appointment ID is required"
        });
    });

    it("should assign appointment successfully", async () => {
        mockedUpdateAppointmentAccountID.mockResolvedValue(undefined);

        const req = mockAuthReq({ accountId: "acc1", body: { appointmentId: 5, patientId: "p1", patientName: "Jane" } });
        const res = mockRes();

        await assignAppointmentHandler(req, res);

        expect(mockedUpdateAppointmentAccountID).toHaveBeenCalledWith(5, "acc1", "p1", "Jane");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Appointment assigned successfully"
        });
    });

    it("should default patientId and patientName to null when not provided", async () => {
        mockedUpdateAppointmentAccountID.mockResolvedValue(undefined);

        const req = mockAuthReq({ accountId: "acc1", body: { appointmentId: 5 } });
        const res = mockRes();

        await assignAppointmentHandler(req, res);

        expect(mockedUpdateAppointmentAccountID).toHaveBeenCalledWith(5, "acc1", null, null);
    });

    it("should return 500 if there is an error assigning appointment", async () => {
        mockedUpdateAppointmentAccountID.mockRejectedValue(new Error("Database error"));

        const req = mockAuthReq({ accountId: "acc1", body: { appointmentId: 5 } });
        const res = mockRes();

        await assignAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to update appointment"
        });
    });
});

describe("rescheduleAppointmentHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 401 if accountId is missing", async () => {
        const req = mockAuthReq({ accountId: null, body: { oldAppointmentId: 1, newAppointmentId: 2, patientId: "p1", patientName: "Jane" } });
        const res = mockRes();

        await rescheduleAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authentication required"
        });
    });

    it("should return 400 if oldAppointmentId or newAppointmentId is missing", async () => {
        const req = mockAuthReq({ accountId: "acc1", body: { oldAppointmentId: 1, patientId: "p1", patientName: "Jane" } });
        const res = mockRes();

        await rescheduleAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Old Appointment ID and New Appointment ID are required"
        });
    });

    it("should return 400 if patientId or patientName is missing", async () => {
        const req = mockAuthReq({ accountId: "acc1", body: { oldAppointmentId: 1, newAppointmentId: 2 } });
        const res = mockRes();

        await rescheduleAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Patient ID and Patient Name are required"
        });
    });

    it("should reschedule appointment successfully", async () => {
        mockedRescheduleAppointment.mockResolvedValue(undefined);

        const req = mockAuthReq({ accountId: "acc1", body: { oldAppointmentId: 1, newAppointmentId: 2, patientId: "p1", patientName: "Jane" } });
        const res = mockRes();

        await rescheduleAppointmentHandler(req, res);

        expect(mockedRescheduleAppointment).toHaveBeenCalledWith(1, 2, "acc1", "p1", "Jane");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Appointment rescheduled successfully"
        });
    });

    it("should return 500 if there is an error rescheduling appointment", async () => {
        mockedRescheduleAppointment.mockRejectedValue(new Error("Database error"));

        const req = mockAuthReq({ accountId: "acc1", body: { oldAppointmentId: 1, newAppointmentId: 2, patientId: "p1", patientName: "Jane" } });
        const res = mockRes();

        await rescheduleAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to update appointment"
        });
    });
});

describe("getNextAvailableAppointmentHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if doctorId is missing", async () => {
        const req = mockReq({ query: {} });
        const res = mockRes();

        await getNextAvailableAppointmentHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Doctor ID is required"
        });
    });

    it("should return the next available appointment for a valid doctorId", async () => {
        const nextAppointment: Appointment = { ...mockAppointment, id: 10, doctor_id: 3, date: "2024-08-01", time: "09:00" };
        mockedGetNextAvailableAppointmentDate.mockResolvedValue(nextAppointment);

        const req = mockReq({ query: { doctorId: "3" } });
        const res = mockRes();

        await getNextAvailableAppointmentHandler(req, res);

        expect(mockedGetNextAvailableAppointmentDate).toHaveBeenCalledWith(3);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            nextAvailable: nextAppointment
        });
    });

    it("should return 500 if there is an error retrieving next available appointment", async () => {
        mockedGetNextAvailableAppointmentDate.mockRejectedValue(new Error("Database error"));

        const req = mockReq({ query: { doctorId: "3" } });
        const res = mockRes();

        await getNextAvailableAppointmentHandler(req, res);

        expect(mockedGetNextAvailableAppointmentDate).toHaveBeenCalledWith(3);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to retrieve next available appointment date"
        });
    });
});

describe("getLastAppointmentBySpecialtyHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if patientId is missing", async () => {
        const req = mockReq({ query: {} });
        const res = mockRes();

        await getLastAppointmentBySpecialtyHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Patient ID is required"
        });
    });

    it("should return last visit per specialty for a valid patientId", async () => {
        const mockResults = [
            { specialty: "Cardiology", lastVisit: "2024-06-15" },
            { specialty: "Dermatology", lastVisit: "2024-05-10" }
        ];
        mockedGetLastVisitPerSpecialty.mockResolvedValue(mockResults);

        const req = mockReq({ query: { patientId: "p1" } });
        const res = mockRes();

        await getLastAppointmentBySpecialtyHandler(req, res);

        expect(mockedGetLastVisitPerSpecialty).toHaveBeenCalledWith("p1");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            lastVisitPerSpecialty: mockResults
        });
    });

    it("should return 500 if there is an error retrieving last appointment by specialty", async () => {
        mockedGetLastVisitPerSpecialty.mockRejectedValue(new Error("Database error"));

        const req = mockReq({ query: { patientId: "p1" } });
        const res = mockRes();

        await getLastAppointmentBySpecialtyHandler(req, res);

        expect(mockedGetLastVisitPerSpecialty).toHaveBeenCalledWith("p1");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to retrieve last appointment by specialty"
        });
    });
});
