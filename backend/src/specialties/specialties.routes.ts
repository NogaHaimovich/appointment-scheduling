import { Router } from "express";
import { getAllSpecialtiesHandler, getDoctorsBySpecialtyHandler } from "./specialties.controller";

const router = Router();

router.get("/", getAllSpecialtiesHandler);
router.get("/doctors-by-specialty", getDoctorsBySpecialtyHandler);

export default router;