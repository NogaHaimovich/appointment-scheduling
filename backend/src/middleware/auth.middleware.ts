import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}


export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = 
    (req as any).cookies?.token || 
    (req as any).headers?.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error" 
      });
    }
    
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    console.error("Token verification error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Authentication error" 
    });
  }
};

