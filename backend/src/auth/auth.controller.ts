import { Request, Response } from "express";
import { generateCode, verifyCode, findAccount, createAccount, generateToken } from "./auth.service";

export async function getCodeHandler(req: Request, res: Response) {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const code = generateCode(phone);

    res.json({
      success: true,
      message: "Verification code generated successfully",
      code
    });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function validateCodeHandler(req: Request, res: Response) {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res
      .status(400)
      .json({ message: "Phone number and code are required" });
  }

  const isValid = verifyCode(phone, code);

  if (!isValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired code" });
  }

  try {
    const account = await findAccount(phone);
    
    if (account) {
      const token = generateToken(account.id);
      return res.json({
        success: true,
        message: "Code verified successfully",
        token,
        requiresName: false,
      });
    } else {
      return res.json({
        success: true,
        message: "Please provide your name to create an account",
        requiresName: true,
      });
    }
  } catch (error) {
    console.error("Error validating code:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function createAccountHandler(req: Request, res: Response) {
  const { phone, name } = req.body;

  if (!phone || !name) {
    return res
      .status(400)
      .json({ message: "Phone number and name are required" });
  }

  try {
    const existingAccount = await findAccount(phone);
    if (existingAccount) {
      const token = generateToken(existingAccount.id);
      return res.json({
        success: true,
        message: "Account already exists",
        token,
      });
    }

    const accountId = await createAccount(phone, name);
    const token = generateToken(accountId);

    res.json({
      success: true,
      message: "Account created successfully",
      token,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

