import { allAsync } from "../../db/dbHelpers";
import { GET_DOCTORS_LIST_BY_SPECIALTY, GET_SPECIALTIES_LIST } from "../../db/queries";
import { getAllSpecialties, getDoctorsBySpecialty } from "../specialties.service";


jest.mock("../../db/dbHelpers", () => ({
  allAsync: jest.fn()
}));

const specialties = [
    {
        id: 1,
        name: "Cardiology"
    },
    {
        id: 2,
        name: "Dermatology"
    }
];

const doctorsBySpecialty = {
    1: [
        {
            id: 1,
            name: "Dr. Smith"
        },
        {
            id: 2,
            name: "Dr. Johnson"
        }
    ],
};


describe("Specialties Service tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all specialties", async () => {
        (allAsync as jest.Mock).mockResolvedValue(specialties);
        const result = await getAllSpecialties();
        expect(allAsync).toHaveBeenCalledWith(GET_SPECIALTIES_LIST);
        expect(result).toEqual(specialties);
    }
    );

    it("should return doctors by specialty id", async () => {
        const specialtyId = 1;
        (allAsync as jest.Mock).mockResolvedValue(doctorsBySpecialty[specialtyId]);
        const result = await getDoctorsBySpecialty(specialtyId);
        expect(allAsync).toHaveBeenCalledWith(GET_DOCTORS_LIST_BY_SPECIALTY, [specialtyId]);
        expect(result).toEqual(doctorsBySpecialty[specialtyId]);
    }
    );

    it("should throw when getAllSpecialties fails", async () => {
        (allAsync as jest.Mock).mockRejectedValue(new Error("db error"));
        await expect(getAllSpecialties()).rejects.toThrow("db error");
    });

    it("should throw when getDoctorsBySpecialty fails", async () => {
        (allAsync as jest.Mock).mockRejectedValue(new Error("db error"));
        await expect(getDoctorsBySpecialty(1)).rejects.toThrow("db error");
    });
});
