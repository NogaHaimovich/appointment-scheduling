import { getResponseFromChatbot } from "./chatbot.service";
import { Request, Response } from "express";


export async function getResponseFromChatbotHandler(req: Request, res: Response) {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required"
        });
    }
    try {
        const response = await getResponseFromChatbot(message);
        res.json({
            success: true,
            response
        });
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get response from chatbot"
        });
    }
}