import express from "express";
import type { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import appointmentsRoutes from "./appointments/appointments.routes";
import authRoutes from "./auth/auth.routes";
import patientsRoutes from "./patients/patients.routes";
import chatbotRoutes from "./chatbot/chatbot.routes";

import { validateEnvVariables } from "./utils/envValidation";
import specialtiesRoutes from "./specialties/specialties.routes";
import { initializeOnStartup } from "./startup";

dotenv.config();

try {
  validateEnvVariables();
} catch (error) {
  console.error("Environment validation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}

const app: Application = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/specialties", specialtiesRoutes);
app.use("/patients", patientsRoutes);
app.use("/chatbot", chatbotRoutes);

initializeOnStartup();

console.log("Routes registered:");
console.log("  - Auth routes: /getCode, /validateCode");
console.log("  - Appointments routes: /appointments/account, /appointments/open-slots-by-doctor-id, etc.");
console.log("  - Specialties routes: /specialties/, /specialties/doctors-by-specialty");
console.log("  - Patients routes: /patients/by-account");

app.use((req: Request, res: Response) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
