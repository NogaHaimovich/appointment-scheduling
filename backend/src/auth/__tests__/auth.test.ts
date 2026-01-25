/// <reference types="jest" />

import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import * as dbHelpers from "../../db/dbHelpers";
import { generateCode, verifyCode, findAccount, createAccount, generateToken } from "../auth.service";

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

  it("should find existing account", async () => {
    (dbHelpers.getAsync as jest.Mock).mockResolvedValueOnce({ id: "account123", name: "John" });
    const account = await findAccount("111");
    expect(account).toEqual({ id: "account123", name: "John" });
    expect(dbHelpers.getAsync).toHaveBeenCalledWith(expect.any(String), ["111"]);
  });

  it("should return null when account not found", async () => {
    (dbHelpers.getAsync as jest.Mock).mockResolvedValueOnce(null);
    const account = await findAccount("222");
    expect(account).toBeNull();
  });

  it("should create new account with patient", async () => {
    (randomUUID as jest.Mock)
      .mockReturnValueOnce("account-uuid")
      .mockReturnValueOnce("patient-uuid");
    (dbHelpers.runAsync as jest.Mock).mockResolvedValue({ changes: 1, lastID: 0 });
    const accountId = await createAccount("333", "Jane");
    expect(accountId).toBe("account-uuid");
    expect(dbHelpers.runAsync).toHaveBeenCalledTimes(2);
    expect(dbHelpers.runAsync).toHaveBeenNthCalledWith(1, expect.any(String), ["account-uuid", "333", "Jane"]);
    expect(dbHelpers.runAsync).toHaveBeenNthCalledWith(2, expect.any(String), ["patient-uuid", "account-uuid", "Jane", "self"]);
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

