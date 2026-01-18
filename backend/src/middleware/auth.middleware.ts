import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  accountId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = req.cookies?.token;
  
  if (!token && authHeader) {
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (headerValue && headerValue.startsWith("Bearer ")) {
      token = headerValue.split(" ")[1];
    }
  }
  
  if (!token) {
    console.log("No token found. Headers:", {
      authorization: req.headers.authorization,
      Authorization: req.headers.Authorization,
      cookies: req.cookies
    });
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
    
    const decoded = jwt.verify(token, secret) as { accountId: string };
    req.accountId = decoded.accountId;
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

