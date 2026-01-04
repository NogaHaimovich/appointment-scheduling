import { Router } from "express";
import {
    getUserAppointmentsHandler,
    getAvailableSlotsByDoctorIdHandler,
    assignAppointmentHandler,
    rescheduleAppointmentHandler,
    getNextAvailableAppointmentHandler
} from "./appointments.controller";

const router = Router();

router.get("/user", getUserAppointmentsHandler);
router.get("/open-slots-by-doctor-id", getAvailableSlotsByDoctorIdHandler);
router.patch("/assign", assignAppointmentHandler);
router.patch("/reschedule", rescheduleAppointmentHandler);
router.get("/next-available", getNextAvailableAppointmentHandler);

export default router;