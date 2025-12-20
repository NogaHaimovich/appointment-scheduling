import { randomUUID } from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { getAsync, runAsync } from "../db/dbHelpers";
import { GET_USER_BY_PHONE, INPUT_NEW_USER } from "../db/queris";

export type CodeEntry = {
  code: string;
  phone: string;
  expiresAt: number;
}

const CODE_EXPIRATION_TIME = 5 * 60 * 1000; 
const codes: Map<string, CodeEntry> = new Map();

export function generateCode(phone: string): string {
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  const expiresAt = Date.now() + CODE_EXPIRATION_TIME;

  codes.set(phone, { code, phone, expiresAt });
  cleanupExpiredCodes();

  return code;
}

export function verifyCode(phone: string, code: string): boolean {
  const entry = codes.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    codes.delete(phone);
    return false;
  }
  if (entry.code !== code) return false;

  codes.delete(phone);
  return true;
}

function cleanupExpiredCodes(): void {
  const now = Date.now();
  for (const [phone, entry] of codes.entries()) {
    if (now > entry.expiresAt) codes.delete(phone);
  }
}

export function getCode(phone: string): CodeEntry | undefined {
  return codes.get(phone);
}

export async function findOrCreateUser(phone: string): Promise<string> {
  const row = await getAsync<{ id: string }>(GET_USER_BY_PHONE, [phone]);
  
  if (row) {
    return row.id; 
  }

  const userId = randomUUID();
  await runAsync(INPUT_NEW_USER, [userId, phone]);
  return userId;
}

export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!expiresIn) {
    throw new Error("JWT_EXPIRES_IN is not defined");
  }

  return jwt.sign(
    { userId },
    secret,
    { expiresIn }
  );
}