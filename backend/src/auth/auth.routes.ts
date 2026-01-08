import { Router } from "express";
import { getCodeHandler, validateCodeHandler, createAccountHandler } from "./auth.controller";

const router = Router();

router.post("/getCode", getCodeHandler);
router.post("/validateCode", validateCodeHandler);
router.post("/createAccount", createAccountHandler);

export default router;
