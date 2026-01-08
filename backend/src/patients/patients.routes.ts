import { Router } from "express";
import { getPatientsByAccountIdHandler } from "./patients.controller";

const router = Router();

router.get("/by-account", getPatientsByAccountIdHandler);

export default router;

