import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const USERS_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../data/localUsers.json"
);

/** In-memory user store — persisted to disk when MongoDB is unavailable */
const usersById = new Map();
const usersByEmail = new Map();

function toPublicUser(user) {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  return rest;
}

function saveUser(user) {
  usersById.set(user.id, user);
  usersByEmail.set(user.email.toLowerCase(), user);
  return user;
}

async function persistUsers() {
  try {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify([...usersById.values()], null, 2));
  } catch (err) {
    console.warn("[memory] Could not persist users:", err.message);
  }
}

async function loadPersistedUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const users = JSON.parse(raw);
    if (!Array.isArray(users)) return;
    for (const user of users) {
      if (user?.id && user?.email) saveUser(user);
    }
    console.log(`[memory] Loaded ${users.length} user(s) from disk`);
  } catch {
    /* first run — no file yet */
  }
}

function loginError(message, status = 401) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/** Suggest a close email match (typo help) */
function findSimilarEmail(email) {
  const target = email.trim().toLowerCase();
  const [local, domain] = target.split("@");
  if (!local || !domain) return null;

  let best = null;
  let bestDist = 3;

  for (const user of usersByEmail.values()) {
    const [otherLocal, otherDomain] = user.email.split("@");
    if (otherDomain !== domain) continue;

    const dist = levenshtein(local, otherLocal);
    if (dist > 0 && dist < bestDist) {
      bestDist = dist;
      best = user.email;
    }
  }

  return best;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export async function seedMemoryUsers() {
  await loadPersistedUsers();

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
    {
      fullName: "Demo Student",
      email: "guest@campusflow.demo",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      rollNumber: "CS2021999",
      isGuest: true,
      authProvider: "guest",
    },
    {
      fullName: "Avinash Singh",
      email: "avinash@gmail.com",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      rollNumber: "CS2021042",
      isGuest: false,
      authProvider: "google",
    },
  ];

  let seeded = 0;
  for (const demo of demos) {
    if (await findUserByEmail(demo.email)) continue;

    const hashed = demo.password ? await bcrypt.hash(demo.password, 10) : undefined;
    saveUser({
      id: randomUUID(),
      fullName: demo.fullName,
      email: demo.email.toLowerCase(),
      password: hashed,
      department: demo.department,
      year: demo.year,
      role: demo.role,
      rollNumber: demo.rollNumber,
      imageUrl: null,
      isGuest: demo.isGuest || false,
      authProvider: demo.authProvider,
      firebaseUid: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    seeded += 1;
    console.log(`[memory] Seeded ${demo.role}: ${demo.email}`);
  }

  if (seeded > 0) await persistUsers();
}

export async function findUserById(id) {
  return toPublicUser(usersById.get(id) || null);
}

export async function findUserByEmail(email, { withPassword = false } = {}) {
  if (!email) return null;
  const user = usersByEmail.get(email.trim().toLowerCase());
  if (!user) return null;
  if (withPassword) return user;
  return toPublicUser(user);
}

export async function registerUser({ fullName, email, password, department, year, role }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await findUserByEmail(normalizedEmail, { withPassword: true });
  if (existing) {
    if (!existing.password && password) {
      existing.password = await bcrypt.hash(password, 10);
      existing.authProvider = "local";
      existing.updatedAt = new Date().toISOString();
      saveUser(existing);
      await persistUsers();
      return toPublicUser(existing);
    }
    throw loginError("Email already registered. Please login instead.", 409);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = saveUser({
    id: randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashed,
    department: department || "Computer Science",
    year: year || "3rd Year",
    role: role || "student",
    rollNumber: `CS${Date.now().toString().slice(-6)}`,
    imageUrl: null,
    isGuest: false,
    authProvider: "local",
    firebaseUid: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await persistUsers();
  return toPublicUser(user);
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw loginError("Email and password are required", 400);
  }

  const user = await findUserByEmail(normalizedEmail, { withPassword: true });
  if (!user) {
    const similar = findSimilarEmail(normalizedEmail);
    if (similar) {
      throw loginError(
        `No account found with this email. Did you mean ${similar}? Check for typos.`
      );
    }
    throw loginError("No account found with this email. Please sign up first.");
  }
  if (!user.password) {
    throw loginError("This account uses Google Sign-In. Please use Continue with Google.");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw loginError("Incorrect password. Please try again.");
  }

  return toPublicUser(user);
}

export async function getOrCreateGuestUser() {
  let user = await findUserByEmail("guest@campusflow.demo", { withPassword: true });
  if (!user) {
    user = saveUser({
      id: randomUUID(),
      fullName: "Demo Student",
      email: "guest@campusflow.demo",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      rollNumber: "CS2021999",
      isGuest: true,
      authProvider: "guest",
      imageUrl: null,
      firebaseUid: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await persistUsers();
  }
  return toPublicUser(user);
}

export async function getOrCreateGoogleUser() {
  let user = await findUserByEmail("avinash@gmail.com", { withPassword: true });
  if (!user) {
    user = saveUser({
      id: randomUUID(),
      fullName: "Avinash Singh",
      email: "avinash@gmail.com",
      department: "Computer Science",
      year: "3rd Year",
      role: "student",
      rollNumber: "CS2021042",
      isGuest: false,
      authProvider: "google",
      imageUrl: null,
      firebaseUid: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await persistUsers();
  }
  return toPublicUser(user);
}

export async function loginOrCreateFirebaseUser({ uid, email, fullName, photoURL, role = "student" }) {
  if (!uid || !email) {
    throw loginError("uid and email are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user =
    [...usersById.values()].find(
      (u) => u.firebaseUid === uid || u.email === normalizedEmail
    ) || null;

  if (!user) {
    user = saveUser({
      id: randomUUID(),
      fullName: fullName || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      firebaseUid: uid,
      imageUrl: photoURL || null,
      role,
      department: "Computer Science",
      year: "3rd Year",
      rollNumber: `CS${Date.now().toString().slice(-6)}`,
      authProvider: "google",
      isGuest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    user.firebaseUid = user.firebaseUid || uid;
    user.fullName = fullName || user.fullName;
    user.imageUrl = photoURL || user.imageUrl;
    user.authProvider = "google";
    user.updatedAt = new Date().toISOString();
    saveUser(user);
  }

  await persistUsers();
  return toPublicUser(user);
}

export async function updateUserProfile(id, patch) {
  const user = usersById.get(id);
  if (!user) {
    throw loginError("User not found", 404);
  }

  const allowed = ["fullName", "department", "year", "rollNumber", "imageUrl"];
  for (const key of allowed) {
    if (patch[key] !== undefined) user[key] = patch[key];
  }
  user.updatedAt = new Date().toISOString();
  saveUser(user);
  await persistUsers();
  return toPublicUser(user);
}

export async function listUsersByRole(role) {
  const users = [...usersById.values()];
  const filtered = role && role !== "all" ? users.filter((u) => u.role === role) : users;
  return filtered.map(toPublicUser).sort((a, b) => a.role.localeCompare(b.role));
}

export async function getUserStatsByRole() {
  const stats = {};
  for (const user of usersById.values()) {
    stats[user.role] = (stats[user.role] || 0) + 1;
  }
  return Object.entries(stats)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => a.role.localeCompare(b.role));
}
