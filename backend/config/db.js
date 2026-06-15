import mongoose from "mongoose";

let dbConnected = false;

/** Reuse MongoDB connection across Vercel serverless invocations */
const globalCache = globalThis;

if (!globalCache.__campusflowMongoose) {
  globalCache.__campusflowMongoose = { conn: null, promise: null };
}

const cache = globalCache.__campusflowMongoose;

export function isDbConnected() {
  return dbConnected && mongoose.connection.readyState === 1;
}

export function getDbMode() {
  return isDbConnected() ? "mongodb" : "memory";
}

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGO_URI is not set — using in-memory auth mode.");
    return false;
  }

  if (cache.conn && mongoose.connection.readyState === 1) {
    dbConnected = true;
    return true;
  }

  mongoose.set("strictQuery", true);

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        maxPoolSize: 10,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cache.conn = await cache.promise;
    dbConnected = true;
    console.log("MongoDB connected:", mongoose.connection.name);
    return true;
  } catch (err) {
    cache.promise = null;
    dbConnected = false;
    console.warn("MongoDB connection failed:", err.message);
    console.warn("→ Using in-memory auth mode. Login/signup will still work with demo users.");
    await logWhitelistHint();
    return false;
  }
}

async function logWhitelistHint() {
  if (process.env.VERCEL) {
    console.warn("→ On Vercel: add MONGO_URI + allow 0.0.0.0/0 in Atlas Network Access");
    return;
  }
  try {
    const res = await fetch("https://api.ipify.org?format=text");
    const ip = (await res.text()).trim();
    if (ip) {
      console.warn(`→ Add this IP in Atlas → Network Access: ${ip}`);
    }
  } catch {
    /* offline — skip */
  }
  console.warn("→ Or allow all IPs (dev only): 0.0.0.0/0");
  console.warn("→ Atlas guide: https://www.mongodb.com/docs/atlas/security-whitelist/");
}
