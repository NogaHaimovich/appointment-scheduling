import { Request, Response } from "express";
import { generateCode, verifyCode, findOrCreateUser, generateToken } from "./auth.service";

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
    const userId = await findOrCreateUser(phone);
    const token = generateToken(userId);

    res.json({
      success: true,
      message: "Code verified successfully",
      token,
    });
  } catch (error) {
    console.error("Error validating code:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

