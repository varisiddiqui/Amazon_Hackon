import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getTransportPayload } from "../store/index.js";
import { getTransportAIAnswer } from "../data/transportData.js";

const router = Router();

router.get("/", authRequired, (_req, res) => {
  return res.json({ ok: true, data: getTransportPayload() });
});

router.get("/ai", authRequired, (req, res) => {
  const { q = "" } = req.query;
  return res.json({ ok: true, data: getTransportAIAnswer(q) });
});

export default router;
