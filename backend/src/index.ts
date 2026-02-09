import dotenv from "dotenv";

dotenv.config();

import express from "express";
import type { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import appointmentsRoutes from "./appointments/appointments.routes";
import authRoutes from "./auth/auth.routes";
import patientsRoutes from "./patients/patients.routes";
import chatbotRoutes from "./chatbot/chatbot.routes";

import { validateEnvVariables } from "./utils/envValidation";
import specialtiesRoutes from "./specialties/specialties.routes";
import { initializeOnStartup } from "./startup";

try {
  validateEnvVariables();
} catch (error) {
  console.error("Environment validation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}

const app: Application = express();
const PORT = process.env.PORT || 5000;

const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

console.log("CORS Origins configured:", corsOrigins);
console.log("NODE_ENV:", process.env.NODE_ENV);

app.use(cors({
  origin: (origin, callback) => {
    console.log(`CORS request from origin: ${origin || 'no origin'}`);
    
    if (!origin) {
      console.log("Allowing request with no origin");
      return callback(null, true);
    }
    
    if (corsOrigins.includes(origin)) {
      console.log(`Allowing CORS request from: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}. Allowed origins:`, corsOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200, 
  preflightContinue: false,
  maxAge: 86400 
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/specialties", specialtiesRoutes);
app.use("/patients", patientsRoutes);
app.use("/chatbot", chatbotRoutes);

initializeOnStartup();

app.use((req: Request, res: Response) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
