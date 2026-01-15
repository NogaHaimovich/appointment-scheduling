import { Router } from "express";
import {
    getAccountAppointmentsHandler,
    getAvailableSlotsByDoctorIdHandler,
    assignAppointmentHandler,
    rescheduleAppointmentHandler,
    getNextAvailableAppointmentHandler
} from "./appointments.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/open-slots-by-doctor-id", getAvailableSlotsByDoctorIdHandler);
router.get("/next-available", getNextAvailableAppointmentHandler);

router.get("/account", authenticateToken, getAccountAppointmentsHandler);
router.patch("/assign", authenticateToken, assignAppointmentHandler);
router.patch("/reschedule", authenticateToken, rescheduleAppointmentHandler);

export default router;