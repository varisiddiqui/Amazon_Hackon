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
const PORT = process.env.PORT || 5002;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: [CLIENT_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

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
    storage:
      mode === "mongodb"
        ? "MongoDB Atlas (campusflow → users collection)"
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

async function start() {
  const mongoOk = await connectDB();
  if (mongoOk) {
    await migrateLocalUsersToMongo();
  }
  await seedDemoUsers();

  const server = app.listen(PORT, () => {
    console.log(`CampusFlow API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    if (mongoOk) {
      console.log("Auth mode: MongoDB Atlas — signup/login saves to database");
    } else {
      console.log("Auth mode: local file (MongoDB offline) — data NOT in Atlas");
      console.log("→ Fix Atlas Network Access, then restart backend");
    }
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the other server or set PORT=5003 in backend/.env`);
    } else {
      console.error("Failed to start server:", err.message);
    }
    process.exit(1);
  });
}

start();
