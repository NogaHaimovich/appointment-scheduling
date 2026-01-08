import { Router } from "express";
import { getPatientsByAccountIdHandler, addPatientToAccountHandler, deletePatientByIdHandler } from "./patients.controller";

const router = Router();

router.post("/add-patient", addPatientToAccountHandler)
router.get("/by-account", getPatientsByAccountIdHandler);
router.delete("/delete-patient", deletePatientByIdHandler);

export default router;

