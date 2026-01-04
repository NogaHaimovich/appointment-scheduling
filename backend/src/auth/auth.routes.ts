import { Router } from "express";
import { getCodeHandler, validateCodeHandler } from "./auth.controller";

const router = Router();

router.post("/getCode", getCodeHandler);
router.post("/validateCode", validateCodeHandler);

export default router;
