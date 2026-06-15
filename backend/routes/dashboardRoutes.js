import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { resolveUser } from "../utils/resolveUser.js";
import {
  getDashboardBrief,
  getStudentProfileData,
  getActivitySection,
} from "../store/index.js";

const router = Router();

router.get("/brief", authRequired, async (req, res) => {
  try {
    const user = await resolveUser(req);
    return res.json({ ok: true, data: getDashboardBrief(user) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/context", authRequired, async (req, res) => {
  try {
    const user = await resolveUser(req);
    return res.json({ ok: true, data: getStudentProfileData(user).context });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/activities/:type", authRequired, (req, res) => {
  const section = getActivitySection(req.params.type);
  if (!section) {
    return res.status(404).json({ ok: false, error: "Unknown activity section" });
  }
  return res.json({ ok: true, data: section });
});

export default router;
