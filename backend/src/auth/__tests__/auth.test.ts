import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import * as dbHelpers from "../../db/dbHelpers";
import { generateCode, verifyCode, findOrCreateAccount, generateToken } from "../auth.service";

jest.mock("crypto", () => ({ randomUUID: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));
jest.mock("../../db/dbHelpers");

describe("Minimal Auth tests", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create a 5-character code and prevent reuse after verification", () => {
    const phone = "1234567890";
    const code = generateCode(phone);
    expect(code).toHaveLength(5);
    expect(verifyCode(phone, code)).toBe(true);
    expect(verifyCode(phone, code)).toBe(false); 
  });

  it("should reject wrong code", () => {
    const phone = "1234567890";
    generateCode(phone);
    expect(verifyCode(phone, "99999")).toBe(false);
  });

  it("should return existing account or create new", async () => {
    (dbHelpers.getAsync as jest.Mock).mockResolvedValueOnce({ id: "account123" });
    const existing = await findOrCreateAccount("111");
    expect(existing).toBe("account123");

    (dbHelpers.getAsync as jest.Mock).mockResolvedValueOnce(null);
    (randomUUID as jest.Mock).mockReturnValue("new-uuid");
    const created = await findOrCreateAccount("222");
    expect(created).toBe("new-uuid");
    expect(dbHelpers.runAsync).toHaveBeenCalledWith(expect.any(String), ["new-uuid", "222"]);
  });

  it("should generate JWT token", () => {
    process.env.JWT_SECRET = "secret";
    process.env.JWT_EXPIRES_IN = "1h";
    (jwt.sign as jest.Mock).mockReturnValue("token123");

    const token = generateToken("account1");
    expect(token).toBe("token123");
    expect(jwt.sign).toHaveBeenCalledWith({ accountId: "account1" }, "secret", { expiresIn: "1h" });
  });

  it("should throw if JWT_SECRET missing", () => {
    delete process.env.JWT_SECRET;
    process.env.JWT_EXPIRES_IN = "1h";
    expect(() => generateToken("u")).toThrow("JWT_SECRET is not defined");
  });

  it("should throw if JWT_EXPIRES_IN missing", () => {
    process.env.JWT_SECRET = "secret";
    delete process.env.JWT_EXPIRES_IN;
    expect(() => generateToken("u")).toThrow("JWT_EXPIRES_IN is not defined");
  });
});

