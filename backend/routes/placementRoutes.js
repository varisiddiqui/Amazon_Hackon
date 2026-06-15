import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getPlacementPayload,
  getCompanyRoadmap,
  analyzeResumeUpload,
} from "../store/index.js";
import { getPlacementAIAnswer } from "../data/placementData.js";

const router = Router();

router.get("/", authRequired, (_req, res) => {
  return res.json({ ok: true, data: getPlacementPayload() });
});

router.get("/roadmap/:company", authRequired, (req, res) => {
  return res.json({ ok: true, data: getCompanyRoadmap(req.params.company) });
});

router.post("/resume/analyze", authRequired, (_req, res) => {
  return res.json({ ok: true, data: analyzeResumeUpload() });
});

router.get("/ai", authRequired, (req, res) => {
  const { q = "" } = req.query;
  return res.json({ ok: true, data: getPlacementAIAnswer(q) });
});

export default router;
