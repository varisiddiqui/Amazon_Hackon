import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { resolveUser } from "../utils/resolveUser.js";
import {
  askAI,
  summarizeNoticeText,
  analyzeResume,
  generateStudyPlan,
  getAttendanceAdvice,
  getPlacementRoadmap,
  getEventRecommendations,
  getSmartReminders,
  getAllNotices,
  getNoticeById,
  getGeminiConfig,
} from "../services/aiService.js";

const router = Router();

router.get("/status", authRequired, (_req, res) => {
  const gemini = getGeminiConfig();
  return res.json({
    ok: true,
    ai: {
      chat: gemini.configured ? "google-gemini" : "campusgpt-local",
      gemini,
    },
  });
});

router.post("/chat", authRequired, async (req, res) => {
  const { question } = req.body;
  if (!question?.trim()) {
    return res.status(400).json({ ok: false, error: "question is required" });
  }

  try {
    const user = await resolveUser(req);
    const data = await askAI(question, user);
    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/tools/notice-summary", authRequired, async (req, res) => {
  const { noticeId, text } = req.body;
  if (noticeId) {
    const notice = getNoticeById(noticeId);
    if (!notice) return res.status(404).json({ ok: false, error: "Notice not found" });
    const data = await summarizeNoticeText(notice.fullText);
    return res.json({ ok: true, data });
  }
  const data = await summarizeNoticeText(text || "");
  return res.json({ ok: true, data });
});

router.post("/tools/resume", authRequired, (_req, res) => {
  return res.json({ ok: true, data: analyzeResume() });
});

router.post("/tools/study-plan", authRequired, (req, res) => {
  const { days } = req.body;
  return res.json({ ok: true, data: generateStudyPlan(days) });
});

router.post("/tools/attendance-advice", authRequired, (req, res) => {
  const { action } = req.body;
  return res.json({ ok: true, data: getAttendanceAdvice(action) });
});

router.get("/tools/placement-roadmap", authRequired, (req, res) => {
  const { company = "Amazon" } = req.query;
  return res.json({ ok: true, data: getPlacementRoadmap(company) });
});

router.get("/tools/event-recommendations", authRequired, (_req, res) => {
  return res.json({ ok: true, data: getEventRecommendations() });
});

router.get("/tools/reminders", authRequired, (_req, res) => {
  return res.json({ ok: true, data: getSmartReminders() });
});

router.get("/notices", authRequired, (_req, res) => {
  return res.json({ ok: true, data: getAllNotices() });
});

export default router;
