import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { resolveUser } from "../utils/resolveUser.js";
import { getStudentProfileData } from "../store/index.js";
import { notices as allNotices } from "../data/studentData.js";

const router = Router();

router.get("/assignments", authRequired, async (req, res) => {
  try {
    const user = await resolveUser(req);
    return res.json({ ok: true, data: getStudentProfileData(user).assignments });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/attendance", authRequired, async (req, res) => {
  try {
    const user = await resolveUser(req);
    return res.json({ ok: true, data: getStudentProfileData(user).attendance });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/notices", authRequired, (_req, res) => {
  return res.json({ ok: true, data: allNotices });
});

router.get("/notices/:id", authRequired, (req, res) => {
  const notice = allNotices.find((n) => n.id === Number(req.params.id));
  if (!notice) return res.status(404).json({ ok: false, error: "Notice not found" });
  return res.json({ ok: true, data: notice });
});

router.get("/reminders", authRequired, async (req, res) => {
  try {
    const user = await resolveUser(req);
    return res.json({ ok: true, data: getStudentProfileData(user).reminders });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/profile", authRequired, async (req, res) => {
  try {
    const user = await resolveUser(req);
    return res.json({ ok: true, data: getStudentProfileData(user) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
