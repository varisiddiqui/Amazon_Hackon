import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getHostelPayload, addComplaint, addLeaveRequest } from "../store/index.js";
import { getHostelAIAnswer } from "../data/hostelData.js";

const router = Router();

router.get("/", authRequired, (req, res) => {
  return res.json({ ok: true, data: getHostelPayload(req.auth.id) });
});

router.post("/complaints", authRequired, (req, res) => {
  const { title, category } = req.body;
  if (!title || !category) {
    return res.status(400).json({ ok: false, error: "title and category are required" });
  }
  const complaint = addComplaint(req.auth.id, { title, category });
  return res.status(201).json({ ok: true, data: complaint });
});

router.post("/leave-requests", authRequired, (req, res) => {
  const { from, to, reason } = req.body;
  if (!from || !to || !reason) {
    return res.status(400).json({ ok: false, error: "from, to and reason are required" });
  }
  const request = addLeaveRequest(req.auth.id, { from, to, reason });
  return res.status(201).json({ ok: true, data: request });
});

router.get("/ai", authRequired, (req, res) => {
  const { q = "" } = req.query;
  return res.json({ ok: true, data: getHostelAIAnswer(q) });
});

export default router;
