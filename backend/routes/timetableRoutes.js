import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getTimetablePayload,
  addPersonalEvent,
  getStudyRecommendation,
} from "../store/index.js";

const router = Router();

router.get("/", authRequired, (req, res) => {
  return res.json({ ok: true, data: getTimetablePayload(req.auth.id) });
});

router.get("/next-class", authRequired, (req, res) => {
  const data = getTimetablePayload(req.auth.id);
  return res.json({ ok: true, data: data.nextClass });
});

router.get("/study-recommendation", authRequired, (req, res) => {
  const subject = req.query.subject || "DBMS";
  return res.json({ ok: true, data: getStudyRecommendation(subject) });
});

router.post("/personal-events", authRequired, (req, res) => {
  const { title, day, time, icon } = req.body;
  if (!title || !day || !time) {
    return res.status(400).json({ ok: false, error: "title, day and time are required" });
  }
  const event = addPersonalEvent(req.auth.id, { title, day, time, icon });
  return res.status(201).json({ ok: true, data: event });
});

export default router;
