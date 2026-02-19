import { Request, Response } from "express";
import { getCodeHandler, validateCodeHandler, createAccountHandler } from "../auth.controller";
import { generateCode, verifyCode, findAccount, createAccount, generateToken } from "../auth.service";

jest.mock("../auth.service");
const mockedGenerateCode = generateCode as jest.MockedFunction<typeof generateCode>;
const mockedVerifyCode = verifyCode as jest.MockedFunction<typeof verifyCode>;
const mockedFindAccount = findAccount as jest.MockedFunction<typeof findAccount>;
const mockedCreateAccount = createAccount as jest.MockedFunction<typeof createAccount>;
const mockedGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>;

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;
}

function mockReq(overrides: { body?: Record<string, unknown> }): Request {
    return overrides as unknown as Request;
}

describe("getCodeHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if phone is missing", async () => {
        const req = mockReq({ body: {} });
        const res = mockRes();

        await getCodeHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Phone number is required" });
    });

    it("should return generated code on success", async () => {
        mockedGenerateCode.mockReturnValue("12345");

        const req = mockReq({ body: { phone: "0501234567" } });
        const res = mockRes();

        await getCodeHandler(req, res);

        expect(mockedGenerateCode).toHaveBeenCalledWith("0501234567");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Verification code generated successfully",
            code: "12345"
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedGenerateCode.mockImplementation(() => { throw new Error("fail"); });

        const req = mockReq({ body: { phone: "0501234567" } });
        const res = mockRes();

        await getCodeHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
});

describe("validateCodeHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if phone or code is missing", async () => {
        const req = mockReq({ body: { phone: "0501234567" } });
        const res = mockRes();

        await validateCodeHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Phone number and code are required" });
    });

    it("should return 400 if code is invalid", async () => {
        mockedVerifyCode.mockReturnValue(false);

        const req = mockReq({ body: { phone: "0501234567", code: "99999" } });
        const res = mockRes();

        await validateCodeHandler(req, res);

        expect(mockedVerifyCode).toHaveBeenCalledWith("0501234567", "99999");
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid or expired code" });
    });

    it("should return token if account exists", async () => {
        mockedVerifyCode.mockReturnValue(true);
        mockedFindAccount.mockResolvedValue({ id: "acc-1", name: "John" });
        mockedGenerateToken.mockReturnValue("jwt-token-123");

        const req = mockReq({ body: { phone: "0501234567", code: "12345" } });
        const res = mockRes();

        await validateCodeHandler(req, res);

        expect(mockedFindAccount).toHaveBeenCalledWith("0501234567");
        expect(mockedGenerateToken).toHaveBeenCalledWith("acc-1");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Code verified successfully",
            token: "jwt-token-123",
            requiresName: false
        });
    });

    it("should return requiresName if account does not exist", async () => {
        mockedVerifyCode.mockReturnValue(true);
        mockedFindAccount.mockResolvedValue(null);

        const req = mockReq({ body: { phone: "0501234567", code: "12345" } });
        const res = mockRes();

        await validateCodeHandler(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Please provide your name to create an account",
            requiresName: true
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedVerifyCode.mockReturnValue(true);
        mockedFindAccount.mockRejectedValue(new Error("DB error"));

        const req = mockReq({ body: { phone: "0501234567", code: "12345" } });
        const res = mockRes();

        await validateCodeHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error",
            error: "DB error"
        });
    });
});

describe("createAccountHandler tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if phone or name is missing", async () => {
        const req = mockReq({ body: { phone: "0501234567" } });
        const res = mockRes();

        await createAccountHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Phone number and name are required" });
    });

    it("should return token for existing account", async () => {
        mockedFindAccount.mockResolvedValue({ id: "acc-1", name: "John" });
        mockedGenerateToken.mockReturnValue("jwt-existing");

        const req = mockReq({ body: { phone: "0501234567", name: "John" } });
        const res = mockRes();

        await createAccountHandler(req, res);

        expect(mockedFindAccount).toHaveBeenCalledWith("0501234567");
        expect(mockedGenerateToken).toHaveBeenCalledWith("acc-1");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Account already exists",
            token: "jwt-existing"
        });
    });

    it("should create account and return token for new user", async () => {
        mockedFindAccount.mockResolvedValue(null);
        mockedCreateAccount.mockResolvedValue("acc-new");
        mockedGenerateToken.mockReturnValue("jwt-new");

        const req = mockReq({ body: { phone: "0501234567", name: "Jane" } });
        const res = mockRes();

        await createAccountHandler(req, res);

        expect(mockedCreateAccount).toHaveBeenCalledWith("0501234567", "Jane");
        expect(mockedGenerateToken).toHaveBeenCalledWith("acc-new");
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Account created successfully",
            token: "jwt-new"
        });
    });

    it("should return 500 if there is an error", async () => {
        mockedFindAccount.mockRejectedValue(new Error("DB error"));

        const req = mockReq({ body: { phone: "0501234567", name: "Jane" } });
        const res = mockRes();

        await createAccountHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error",
            error: "DB error"
        });
    });
});
