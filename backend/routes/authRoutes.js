import { Router } from "express";
import {
  registerUser,
  loginUser,
  getOrCreateGuestUser,
  getOrCreateGoogleUser,
  loginOrCreateFirebaseUser,
  findUserById,
  findUserByEmail,
  updateUserProfile,
  listUsersByRole,
  getUserStatsByRole,
} from "../services/authService.js";
import { authRequired, signToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

function authResponse(user, res) {
  const token = signToken(user);
  return res.json({ ok: true, user, token });
}

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, department, year, role } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ ok: false, error: "fullName, email and password are required" });
    }

    const user = await registerUser({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      department,
      year,
      role,
    });
    return authResponse(user, res);
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ ok: false, error: "Email and password are required" });
    }

    const user = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });
    return authResponse(user, res);
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, error: err.message });
  }
});

router.post("/guest", async (_req, res) => {
  try {
    const user = await getOrCreateGuestUser();
    return authResponse(user, res);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/google", async (_req, res) => {
  try {
    const user = await getOrCreateGoogleUser();
    return authResponse(user, res);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/** Firebase Google Sign-In — sync user to MongoDB */
router.post("/firebase", async (req, res) => {
  try {
    const { uid, email, fullName, photoURL, role } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ ok: false, error: "uid and email are required" });
    }

    const user = await loginOrCreateFirebaseUser({
      uid,
      email,
      fullName,
      photoURL,
      role: role || "student",
    });

    return authResponse(user, res);
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, error: err.message });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await findUserById(req.auth.id);
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }
    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.patch("/me", authRequired, async (req, res) => {
  try {
    const { fullName, department, year, rollNumber, imageUrl } = req.body;
    const user = await updateUserProfile(req.auth.id, {
      ...(fullName && { fullName }),
      ...(department && { department }),
      ...(year && { year }),
      ...(rollNumber && { rollNumber }),
      ...(imageUrl !== undefined && { imageUrl }),
    });
    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, error: err.message });
  }
});

/** Admin: list all users, optionally filter by role */
router.get("/users", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const { role } = req.query;
    const users = await listUsersByRole(role);
    const stats = await getUserStatsByRole();
    return res.json({ ok: true, users, stats });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

/** Check if email exists (for signup validation) */
router.get("/check-email", async (req, res) => {
  try {
    const user = await findUserByEmail(req.query.email);
    return res.json({ ok: true, exists: Boolean(user) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
