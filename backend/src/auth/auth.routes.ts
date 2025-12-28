import { Router, Request, Response } from "express";
import { generateCode, verifyCode, findOrCreateUser, generateToken } from "./auth.service";

const router = Router();

router.post("/getCode", async (req: Request, res: Response) => {
  console.log("Received getCode request with body:", req.body);
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
});

router.post("/validateCode", async (req: Request, res: Response) => {
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
});

export default router;
