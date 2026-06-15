import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB, getDbMode, isDbConnected } from "./config/db.js";
import { seedDemoUsers } from "./services/authService.js";
import { migrateLocalUsersToMongo, listAllMongoUsers } from "./services/migrateLocalUsers.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
import placementRoutes from "./routes/placementRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import awsRoutes from "./routes/awsRoutes.js";
import { isAwsConfigured } from "./config/aws.js";

dotenv.config();

const app = express();

function getAllowedOrigins() {
  const origins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]);

  if (process.env.CLIENT_ORIGIN) origins.add(process.env.CLIENT_ORIGIN);
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) origins.add(`https://${process.env.VERCEL_BRANCH_URL}`);

  return origins;
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowed = getAllowedOrigins();
      if (allowed.has(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

let initPromise = null;

/** Connect DB + seed users (once per serverless instance) */
export async function initApp() {
  if (!initPromise) {
    initPromise = (async () => {
      const mongoOk = await connectDB();
      if (mongoOk) {
        await migrateLocalUsersToMongo();
      } else if (process.env.VERCEL) {
        console.error("MongoDB required on Vercel — set MONGO_URI in Environment Variables");
      }
      await seedDemoUsers();
      return mongoOk;
    })();
  }
  return initPromise;
}

app.use(async (_req, _res, next) => {
  try {
    await initApp();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/health", async (_req, res) => {
  const mode = getDbMode();
  let usersInDb = null;
  if (isDbConnected()) {
    try {
      usersInDb = (await listAllMongoUsers()).length;
    } catch {
      usersInDb = null;
    }
  }

  res.json({
    ok: true,
    status: "ok",
    message: "CampusFlow backend is running",
    mode,
    platform: process.env.VERCEL ? "vercel" : "local",
    storage:
      mode === "mongodb"
        ? "MongoDB Atlas (campusflow → users collection)"
        : process.env.VERCEL
          ? "MongoDB offline — set MONGO_URI on Vercel"
          : "Local file only — MongoDB offline",
    usersInDb,
    aws: isAwsConfigured(),
    version: "1.0.0",
  });
});

app.get("/api", (_req, res) => {
  res.json({
    ok: true,
    name: "CampusFlow API",
    docs: "/api/health",
    routes: {
      auth: "/api/auth",
      dashboard: "/api/dashboard",
      student: "/api/student",
      notifications: "/api/notifications",
      events: "/api/events",
      timetable: "/api/timetable",
      hostel: "/api/hostel",
      transport: "/api/transport",
      placement: "/api/placement",
      settings: "/api/settings",
      ai: "/api/ai",
      aws: "/api/aws",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/aws", awsRoutes);

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: err.message || "Internal server error" });
});

export default app;
