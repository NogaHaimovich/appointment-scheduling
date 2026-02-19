import { Request, Response } from "express";
import { getAllSpecialtiesHandler, getDoctorsBySpecialtyHandler } from "../specialties.controller";
import { getAllSpecialties, getDoctorsBySpecialty } from "../specialties.service";

jest.mock("../specialties.service");
const mockedGetAllSpecialties = getAllSpecialties as jest.MockedFunction<typeof getAllSpecialties>;
const mockedGetDoctorsBySpecialty = getDoctorsBySpecialty as jest.MockedFunction<typeof getDoctorsBySpecialty>;

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;
}

function mockReq(overrides: { query: Record<string, string> }): Request {
    return overrides as unknown as Request;
}

describe("getAllSpecialtiesHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return specialties list on success", async () => {
        const mockSpecialties = [
            { id: 1, specialty_name: "Cardiology", description: "Heart care" },
            { id: 2, specialty_name: "Dermatology", description: "Skin care" }
        ];
        mockedGetAllSpecialties.mockResolvedValue(mockSpecialties);

        const req = mockReq({ query: {} });
        const res = mockRes();

        await getAllSpecialtiesHandler(req, res);

        expect(mockedGetAllSpecialties).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            specialties: mockSpecialties
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedGetAllSpecialties.mockRejectedValue(new Error("Database error"));

        const req = mockReq({ query: {} });
        const res = mockRes();

        await getAllSpecialtiesHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to retrieve specialties list"
        });
    });
});

describe("getDoctorsBySpecialtyHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if specialtyId is missing", async () => {
        const req = mockReq({ query: {} });
        const res = mockRes();

        await getDoctorsBySpecialtyHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Specialty ID is required"
        });
    });

    it("should return 400 if specialtyId is not a valid number", async () => {
        const req = mockReq({ query: { specialtyId: "abc" } });
        const res = mockRes();

        await getDoctorsBySpecialtyHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid specialty ID format"
        });
    });

    it("should return doctors list on success", async () => {
        const mockDoctors = [
            { id: 1, name: "Dr. Smith", specialty_id: 1 },
            { id: 2, name: "Dr. Jones", specialty_id: 1 }
        ];
        mockedGetDoctorsBySpecialty.mockResolvedValue(mockDoctors);

        const req = mockReq({ query: { specialtyId: "1" } });
        const res = mockRes();

        await getDoctorsBySpecialtyHandler(req, res);

        expect(mockedGetDoctorsBySpecialty).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            doctors: mockDoctors
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedGetDoctorsBySpecialty.mockRejectedValue(new Error("Database error"));

        const req = mockReq({ query: { specialtyId: "1" } });
        const res = mockRes();

        await getDoctorsBySpecialtyHandler(req, res);

        expect(mockedGetDoctorsBySpecialty).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to retrieve doctors list"
        });
    });
});
