import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getSettings, saveSettings } from "../store/index.js";

const router = Router();

router.get("/", authRequired, (req, res) => {
  return res.json({ ok: true, data: getSettings(req.auth.id) });
});

router.put("/", authRequired, (req, res) => {
  const saved = saveSettings(req.auth.id, req.body);
  return res.json({ ok: true, data: saved });
});

export default router;
