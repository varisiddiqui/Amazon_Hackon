import dotenv from "dotenv";
import app, { initApp } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

async function start() {
  const mongoOk = await initApp();

  app.listen(PORT, () => {
    console.log(`CampusFlow API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    if (mongoOk) {
      console.log("Auth mode: MongoDB Atlas — signup/login saves to database");
    } else {
      console.log("Auth mode: local file (MongoDB offline) — data NOT in Atlas");
      console.log("→ Fix Atlas Network Access, then restart backend");
    }
  });
}

start();
