import { getCurrentDateTime } from "../../utils/dateUtils";
import { allAsync, getAsync, runAsync } from "../../db/dbHelpers";
import { getAccountAppointments, getAvailableSlotsByDoctorId, getLastVisitPerSpecialty, getNextAvailableAppointmentDate, rescheduleAppointment, updateAppointmentAccountID } from "../appointments.service";

jest.mock("../../db/dbHelpers", () => ({
  allAsync: jest.fn(),
  getAsync: jest.fn(),
  runAsync: jest.fn()
}));

jest.mock("../../utils/dateUtils", () => ({
  getCurrentDateTime: jest.fn()
}));


const mockAppointments = [
  {
    id: 1,
    date: "2024-07-01",
    time: "10:00",
    doctor_id: 1,
    patient_id: "patient1",
    patient_name: "John Doe"
  },
  {
    id: 2,
    date: "2024-07-15",
    time: "14:00",
    doctor_id: 2,
    patient_id: "patient1",
    patient_name: "John Doe"
  },
  {
    id: 3,
    date: "2024-07-01",
    time: "11:00",
    doctor_id: 1,
    patient_id: null,
    patient_name: null
  },
  {
    id: 4,
    date: "2024-07-01",
    time: "12:00",
    doctor_id: 1,
    patient_id: null,
    patient_name: null
  },
];

const mockAccount = {
  id: "account1",
  phone: "1234567890",
  name: "John Doe"
};

const today = "2024-07-10";
const currentTime = "12:00";

describe("Appointments Service tests", () => {

  beforeEach(() => {
    (getCurrentDateTime as jest.Mock).mockReturnValue({ today, currentTime });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getAccountAppointments should return appointment history, upcoming appointments and account name", async () => {
    const accountId = "account1";

    (allAsync as jest.Mock)
      .mockResolvedValueOnce([mockAppointments[1]])
      .mockResolvedValueOnce([mockAppointments[0]]);

    (getAsync as jest.Mock).mockResolvedValue(mockAccount);
    
    const result = await getAccountAppointments(accountId);

    expect(result).toEqual({
      upcomingAppointment: [mockAppointments[1]],
      appointmentHistory: [mockAppointments[0]],
      accountName: "John Doe"
    });

    expect(getCurrentDateTime).toHaveBeenCalledTimes(1);
    expect(allAsync).toHaveBeenCalledTimes(2);
    expect(getAsync).toHaveBeenCalledTimes(1);
    expect(allAsync).toHaveBeenNthCalledWith(1, expect.anything(), [accountId, today, today, currentTime]);
    expect(allAsync).toHaveBeenNthCalledWith(2, expect.anything(), [accountId, today, today, currentTime]);
    expect(getAsync).toHaveBeenCalledWith(expect.anything(), [accountId]);
  });

  it("getAvailableSlotsByDoctorId should return available slots for a doctor", async () => {
    const doctorId = 1;

    (allAsync as jest.Mock).mockResolvedValue([mockAppointments[2], mockAppointments[3]]);

    const result = await getAvailableSlotsByDoctorId(doctorId);

    expect(result).toEqual([mockAppointments[2], mockAppointments[3]]);
    expect(allAsync).toHaveBeenCalledTimes(1);
    expect(allAsync).toHaveBeenCalledWith(expect.anything(), [doctorId, today, today, currentTime]);
  });

  it("updateAppointmentAccountID should update the account ID for an appointment", async () => {
        const appointmentId = 3;
        const accountId = "account1";
        const patientId = "patient1";
        const patientName = "John Doe";

        await updateAppointmentAccountID(appointmentId, accountId, patientId, patientName);

        expect(runAsync).toHaveBeenCalledTimes(1);
        expect(runAsync).toHaveBeenCalledWith(expect.anything(), [accountId, patientId, patientName, appointmentId]);

  });

  it("rescheduleAppointment should reschedule an appointment", async () => {
    const appointmentId = 3;
    const newAppointmentId = 4;
    const accountId = "account1";
    const patientId = "patient1";
    const patientName = "John Doe";

    await rescheduleAppointment(appointmentId, newAppointmentId, accountId, patientId, patientName);

    expect(runAsync).toHaveBeenCalledTimes(2);
    expect(runAsync).toHaveBeenCalledWith(expect.anything(), [accountId, patientId, patientName, newAppointmentId]);
    expect(runAsync).toHaveBeenCalledWith(expect.anything(), [null, null, null, appointmentId]);
    
  });

  it("getNextAvailableAppointmentDate should return the next available appointment date for a doctor", async () => {
    const doctorId = 1;

    (allAsync as jest.Mock).mockResolvedValue([mockAppointments[2], mockAppointments[3]]);

    const result = await getNextAvailableAppointmentDate(doctorId);

    expect(allAsync).toHaveBeenCalledTimes(1);
    expect(allAsync).toHaveBeenCalledWith(expect.anything(), [doctorId, today, today, currentTime]);
    expect(result).toEqual(mockAppointments[2]);
  });

  it("getLastVisitPerSpecialty should return the last visit per specialty for a patient", async () => {
    const patientId = "patient1";
    const mockLastVisits = [
        { specialty: "Cardiology", date: "2024-06-15" },
        { specialty: "Dermatology", date: "2024-05-20" }
    ];

    (allAsync as jest.Mock).mockResolvedValue(mockLastVisits);

    const result = await getLastVisitPerSpecialty(patientId);

    expect(allAsync).toHaveBeenCalledTimes(1);
    expect(allAsync).toHaveBeenCalledWith(expect.anything(), [patientId, today, today, currentTime]);
    expect(result).toEqual(mockLastVisits);
    });  
});
