import { Request, Response } from "express";
import { getResponseFromChatbotHandler } from "../chatbot.controller";
import { getResponseFromChatbot } from "../chatbot.service";

jest.mock("../chatbot.service");
const mockedGetResponseFromChatbot = getResponseFromChatbot as jest.MockedFunction<typeof getResponseFromChatbot>;

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;
}

function mockReq(overrides: { body?: Record<string, unknown> }): Request {
    return overrides as unknown as Request;
}

describe("getResponseFromChatbotHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if message is missing", async () => {
        const req = mockReq({ body: {} });
        const res = mockRes();

        await getResponseFromChatbotHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Message is required"
        });
    });

    it("should return chatbot response on success", async () => {
        mockedGetResponseFromChatbot.mockResolvedValue("Hello! How can I help you?");

        const req = mockReq({ body: { message: "Hi" } });
        const res = mockRes();

        await getResponseFromChatbotHandler(req, res);

        expect(mockedGetResponseFromChatbot).toHaveBeenCalledWith("Hi");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            response: "Hello! How can I help you?"
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedGetResponseFromChatbot.mockRejectedValue(new Error("OpenAI error"));

        const req = mockReq({ body: { message: "Hi" } });
        const res = mockRes();

        await getResponseFromChatbotHandler(req, res);

        expect(mockedGetResponseFromChatbot).toHaveBeenCalledWith("Hi");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Failed to get response from chatbot"
        });
    });
});