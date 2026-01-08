import { Router } from "express";
import {
    getAccountAppointmentsHandler,
    getAvailableSlotsByDoctorIdHandler,
    assignAppointmentHandler,
    rescheduleAppointmentHandler,
    getNextAvailableAppointmentHandler
} from "./appointments.controller";

const router = Router();

router.get("/account", getAccountAppointmentsHandler);
router.get("/open-slots-by-doctor-id", getAvailableSlotsByDoctorIdHandler);
router.patch("/assign", assignAppointmentHandler);
router.patch("/reschedule", rescheduleAppointmentHandler);
router.get("/next-available", getNextAvailableAppointmentHandler);

export default router;