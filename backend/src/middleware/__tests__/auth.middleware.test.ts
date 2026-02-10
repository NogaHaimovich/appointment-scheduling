import { Response, NextFunction } from "express";
import { authenticateToken, AuthRequest } from "../auth.middleware";
import jwt from "jsonwebtoken";


jest.mock("jsonwebtoken");

describe("Auth middleware tests", () => {
    let req: Partial<AuthRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
        process.env.JWT_SECRET = "testsecret";
    });

    afterEach(() => {jest.clearAllMocks();});

    it("use token from Authorization header", () => {
        req.headers = { authorization: "Bearer validtoken" };

        (jwt.verify as jest.Mock).mockReturnValue({ accountId: "account123" });
        authenticateToken(req as AuthRequest, res as Response, next);

        expect(jwt.verify).toHaveBeenCalledWith("validtoken", "testsecret");
        expect(req.accountId).toBe("account123");
        expect(next).toHaveBeenCalled();
    });

    it("use token from cookies if Authorization header is missing", () => {
        req.cookies = { token: "cookietoken" }; 

        (jwt.verify as jest.Mock).mockReturnValue({ accountId: "account456" });
        authenticateToken(req as AuthRequest, res as Response, next);
        expect(jwt.verify).toHaveBeenCalledWith("cookietoken", "testsecret");
        expect(req.accountId).toBe("account456");
        expect(next).toHaveBeenCalled();
    });

    it("return 401 if no token is provided", () => {
        authenticateToken(req as AuthRequest, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            success: false, 
            message: "Authentication required" 
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("return 401 if token is expired", () => {
        req.cookies = { token: "expiredtoken" };

        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new jwt.TokenExpiredError("expired", new Date());
        });

        authenticateToken(req as AuthRequest, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            success: false, 
            message: "Token expired" 
        });
        expect(next).not.toHaveBeenCalled();
        
    });

    it("return 403 if token is invalid", () => {
        req.cookies = { token: "invalidtoken" };

        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new jwt.JsonWebTokenError("invalid");
        });
        authenticateToken(req as AuthRequest, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ 
            success: false, 
            message: "Invalid token" 
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("return 500 if JWT_SECRET is missing", () => {
        delete process.env.JWT_SECRET;
        req.cookies = { token: "sometoken" };

        authenticateToken(req as AuthRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            success: false, 
            message: "Server configuration error" 
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("return 500 if token verification throws unexpected error", () => {
        req.cookies = { token: "sometoken" };   

        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error("Unexpected error");
        });

        authenticateToken(req as AuthRequest, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            success: false, 
            message: "Authentication error" 
        });
        expect(next).not.toHaveBeenCalled();
    });

});
