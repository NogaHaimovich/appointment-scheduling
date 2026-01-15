import { Router } from "express";
import { getPatientsByAccountIdHandler, addPatientToAccountHandler, deletePatientByIdHandler } from "./patients.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/by-account", authenticateToken, getPatientsByAccountIdHandler);
router.post("/add-patient", authenticateToken, addPatientToAccountHandler);
router.delete("/delete-patient", authenticateToken, deletePatientByIdHandler);

export default router;

