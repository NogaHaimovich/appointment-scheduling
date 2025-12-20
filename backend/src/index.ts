import express from "express";
import type { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import appointmentsRoutes from "./routes/appointments.routes";
import authRoutes from "./routes/auth.routes";
import specialtiesRoutes from "./routes/specialties.routes";
import { validateEnvVariables } from "./utils/envValidation";

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


app.use("/api", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/specialties", specialtiesRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
