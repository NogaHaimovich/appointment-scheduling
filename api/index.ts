import express, { type Request, type Response, type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


import { validateEnvVariables } from "../backend/src/utils/envValidation";

try {
  validateEnvVariables();
} catch (error) {
  console.error("Environment validation failed:", error instanceof Error ? error.message : error);

}


import appointmentsRoutes from "../backend/src/appointments/appointments.routes";
import authRoutes from "../backend/src/auth/auth.routes";
import specialtiesRoutes from "../backend/src/specialties/specialties.routes";


import "../backend/src/db/index";

const app: Application = express();


const corsOrigins = process.env.CORS_ORIGIN?.split(",").map(origin => origin.trim()) || [
  "http://localhost:5173",
  "http://localhost:5174"
];

if (process.env.VERCEL_URL) {
  corsOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);
    

    if (corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type"]
}));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

app.use(express.json());
app.use(cookieParser());



app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '') || '/';
  }
  next();
});

app.use("/", authRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/specialties", specialtiesRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
