import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import { isDbConnected } from "../config/db.js";

const LOCAL_USERS_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../data/localUsers.json"
);

/** Sync users from localUsers.json → MongoDB when Atlas is available */
export async function migrateLocalUsersToMongo() {
  if (!isDbConnected()) return { migrated: 0, skipped: 0 };

  let localUsers = [];
  try {
    const raw = await fs.readFile(LOCAL_USERS_FILE, "utf8");
    localUsers = JSON.parse(raw);
    if (!Array.isArray(localUsers)) return { migrated: 0, skipped: 0 };
  } catch {
    return { migrated: 0, skipped: 0 };
  }

  let migrated = 0;
  let skipped = 0;

  for (const u of localUsers) {
    if (!u?.email) continue;

    const email = u.email.trim().toLowerCase();
    const exists = await User.findOne({ email });
    if (exists) {
      skipped += 1;
      continue;
    }

    await User.create({
      fullName: u.fullName,
      email,
      ...(u.password ? { password: u.password } : {}),
      department: u.department || "Computer Science",
      year: u.year || "3rd Year",
      role: u.role || "student",
      rollNumber: u.rollNumber || "",
      imageUrl: u.imageUrl || null,
      isGuest: u.isGuest || false,
      authProvider: u.authProvider || "local",
      ...(u.firebaseUid ? { firebaseUid: u.firebaseUid } : {}),
    });

    migrated += 1;
    console.log(`[migrate] Synced to MongoDB: ${email}`);
  }

  if (migrated > 0) {
    console.log(`[migrate] ${migrated} user(s) moved from local file → MongoDB Atlas`);
  }

  return { migrated, skipped };
}

export async function listAllMongoUsers() {
  if (!isDbConnected()) return [];
  return User.find().select("email fullName role createdAt").sort({ createdAt: -1 });
}
