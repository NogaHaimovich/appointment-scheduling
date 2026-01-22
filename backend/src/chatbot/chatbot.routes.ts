import { Router } from "express";
import { getResponseFromChatbotHandler } from "./chatbot.controller";

const router = Router();

router.post("/", getResponseFromChatbotHandler);

export default router;