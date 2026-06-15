import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { isDbConnected } from "../config/db.js";
import * as memoryAuth from "./memoryAuthStore.js";

export function toPublicUser(doc) {
  if (!doc) return null;
  if (typeof doc.toPublicJSON === "function") return doc.toPublicJSON();
  return {
    id: doc._id?.toString() || doc.id,
    fullName: doc.fullName,
    email: doc.email,
    department: doc.department,
    year: doc.year,
    role: doc.role,
    rollNumber: doc.rollNumber,
    imageUrl: doc.imageUrl,
    isGuest: doc.isGuest,
    authProvider: doc.authProvider,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function findUserById(id) {
  if (!isDbConnected()) return memoryAuth.findUserById(id);
  if (!id) return null;
  const user = await User.findById(id);
  return user ? toPublicUser(user) : null;
}

export async function findUserByEmail(email, options) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  if (!isDbConnected()) return memoryAuth.findUserByEmail(normalized, options);
  let query = User.findOne({ email: normalized });
  if (options?.withPassword) query = query.select("+password");
  const user = await query;
  return user;
}

export async function registerUser(payload) {
  const email = payload.email?.trim().toLowerCase();
  const fullName = payload.fullName?.trim();
  const { password, department, year, role } = payload;

  if (!fullName || !email || !password) {
    const err = new Error("fullName, email and password are required");
    err.status = 400;
    throw err;
  }

  if (!isDbConnected()) {
    if (process.env.VERCEL) {
      const err = new Error("Database unavailable. Set MONGO_URI in Vercel Environment Variables.");
      err.status = 503;
      throw err;
    }
    return memoryAuth.registerUser({ fullName, email, password, department, year, role });
  }

  const existing = await findUserByEmail(email, { withPassword: true });
  if (existing) {
    if (!existing.password && password) {
      existing.password = await bcrypt.hash(password, 10);
      existing.authProvider = "local";
      await existing.save();
      return toPublicUser(existing);
    }
    const err = new Error("Email already registered. Please login instead.");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password: hashed,
    department: department || "Computer Science",
    year: year || "3rd Year",
    role: role || "student",
    rollNumber: `CS${Date.now().toString().slice(-6)}`,
    authProvider: "local",
    isGuest: false,
  });

  return toPublicUser(user);
}

export async function loginUser(payload) {
  const email = payload.email?.trim().toLowerCase();
  const { password } = payload;

  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  if (!isDbConnected()) {
    if (process.env.VERCEL) {
      const err = new Error("Database unavailable. Set MONGO_URI in Vercel Environment Variables.");
      err.status = 503;
      throw err;
    }
    return memoryAuth.loginUser({ email, password });
  }

  const user = await findUserByEmail(email, { withPassword: true });
  if (!user) {
    const err = new Error("No account found with this email. Please sign up first.");
    err.status = 401;
    throw err;
  }
  if (!user.password) {
    const err = new Error("This account uses Google Sign-In. Please use Continue with Google.");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error("Incorrect password. Please try again.");
    err.status = 401;
    throw err;
  }

  return toPublicUser(user);
}

export async function getOrCreateGuestUser() {
  if (!isDbConnected()) return memoryAuth.getOrCreateGuestUser();
  let user = await User.findOne({ email: "guest@campusflow.demo" });
  if (!user) {
    user = await User.create({
      fullName: "Demo Student",
      email: "guest@campusflow.demo",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      rollNumber: "CS2021999",
      isGuest: true,
      authProvider: "guest",
    });
  }
  return toPublicUser(user);
}

export async function getOrCreateGoogleUser() {
  if (!isDbConnected()) return memoryAuth.getOrCreateGoogleUser();
  let user = await User.findOne({ email: "avinash@gmail.com" });
  if (!user) {
    user = await User.create({
      fullName: "Avinash Singh",
      email: "avinash@gmail.com",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      rollNumber: "CS2021042",
      isGuest: false,
      authProvider: "google",
    });
  }
  return toPublicUser(user);
}

export async function loginOrCreateFirebaseUser(payload) {
  if (!isDbConnected()) return memoryAuth.loginOrCreateFirebaseUser(payload);
  const { uid, email, fullName, photoURL, role = "student" } = payload;
  if (!uid || !email) {
    const err = new Error("uid and email are required");
    err.status = 400;
    throw err;
  }

  let user = await User.findOne({
    $or: [{ firebaseUid: uid }, { email: email.toLowerCase() }],
  });

  if (!user) {
    user = await User.create({
      fullName: fullName || email.split("@")[0],
      email: email.toLowerCase(),
      firebaseUid: uid,
      imageUrl: photoURL || null,
      role,
      department: "Computer Science",
      year: "3rd Year",
      rollNumber: `CS${Date.now().toString().slice(-6)}`,
      authProvider: "google",
      isGuest: false,
    });
  } else {
    user.firebaseUid = user.firebaseUid || uid;
    user.fullName = fullName || user.fullName;
    user.imageUrl = photoURL || user.imageUrl;
    user.authProvider = "google";
    await user.save();
  }

  return toPublicUser(user);
}

export async function updateUserProfile(id, patch) {
  if (!isDbConnected()) return memoryAuth.updateUserProfile(id, patch);
  const allowed = ["fullName", "department", "year", "rollNumber", "imageUrl"];
  const update = {};
  for (const key of allowed) {
    if (patch[key] !== undefined) update[key] = patch[key];
  }

  const user = await User.findByIdAndUpdate(id, update, { new: true });
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return toPublicUser(user);
}

export async function listUsersByRole(role) {
  if (!isDbConnected()) return memoryAuth.listUsersByRole(role);
  const filter = role && role !== "all" ? { role } : {};
  const users = await User.find(filter).sort({ role: 1, fullName: 1 });
  return users.map((u) => toPublicUser(u));
}

export async function getUserStatsByRole() {
  if (!isDbConnected()) return memoryAuth.getUserStatsByRole();
  const stats = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return stats.map((s) => ({ role: s._id, count: s.count }));
}

export async function seedDemoUsers() {
  if (!isDbConnected()) {
    await memoryAuth.seedMemoryUsers();
    return;
  }
  const demos = [
    {
      fullName: "Avinash Singh",
      email: "demo@campusflow.edu",
      password: "demo1234",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      rollNumber: "CS2021042",
      authProvider: "local",
    },
    {
      fullName: "Dr. Priya Mehta",
      email: "faculty@campusflow.edu",
      password: "demo1234",
      department: "Computer Science",
      year: "Faculty",
      role: "faculty",
      rollNumber: "FAC001",
      authProvider: "local",
    },
    {
      fullName: "Admin User",
      email: "admin@campusflow.edu",
      password: "demo1234",
      department: "Administration",
      year: "Staff",
      role: "admin",
      rollNumber: "ADM001",
      authProvider: "local",
    },
  ];

  for (const demo of demos) {
    const exists = await User.findOne({ email: demo.email });
    if (exists) continue;

    const hashed = await bcrypt.hash(demo.password, 10);
    await User.create({ ...demo, password: hashed, isGuest: false });
    console.log(`Seeded ${demo.role}: ${demo.email}`);
  }

  await getOrCreateGuestUser();
  await getOrCreateGoogleUser();
}
