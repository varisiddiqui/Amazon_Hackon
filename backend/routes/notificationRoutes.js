import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getNotificationsPayload,
  markNotificationRead,
  dismissNotification,
  addNotification,
} from "../store/index.js";

const router = Router();

router.get("/", authRequired, (req, res) => {
  const { type, status } = req.query;
  return res.json({
    ok: true,
    data: getNotificationsPayload(req.auth.id, { type, status }),
  });
});

router.patch("/:id/read", authRequired, (req, res) => {
  const notification = markNotificationRead(req.auth.id, req.params.id);
  if (!notification) return res.status(404).json({ ok: false, error: "Notification not found" });
  return res.json({ ok: true, data: notification });
});

router.patch("/:id/dismiss", authRequired, (req, res) => {
  const notification = dismissNotification(req.auth.id, req.params.id);
  if (!notification) return res.status(404).json({ ok: false, error: "Notification not found" });
  return res.json({ ok: true, data: notification });
});

router.post("/", authRequired, (req, res) => {
  const notification = addNotification(req.auth.id, req.body);
  return res.status(201).json({ ok: true, data: notification });
});

export default router;
