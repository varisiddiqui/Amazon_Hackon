import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { isSesConfigured } from "../config/aws.js";
import { sendEventRegistrationEmail } from "../services/sesService.js";
import { findUserById } from "../services/authService.js";
import {
  getEventsPayload,
  getEventDetail,
  registerForEvent,
  getUserState,
  getEventsAIAnswer,
} from "../store/index.js";

const router = Router();

router.get("/", authRequired, (req, res) => {
  const { category, search, level } = req.query;
  return res.json({
    ok: true,
    data: getEventsPayload(req.auth.id, { category, search, level }),
  });
});

router.get("/registrations", authRequired, (req, res) => {
  const payload = getEventsPayload(req.auth.id);
  return res.json({
    ok: true,
    data: {
      registrationIds: payload.registrations,
      registeredEvents: payload.registeredEvents,
      recommended: payload.recommended,
    },
  });
});

router.get("/ai", authRequired, (req, res) => {
  const { q = "" } = req.query;
  const state = getUserState(req.auth.id);
  return res.json({
    ok: true,
    data: { answer: getEventsAIAnswer(q, state.eventRegistrations) },
  });
});

router.get("/:id", authRequired, (req, res) => {
  const detail = getEventDetail(req.params.id, req.auth.id);
  if (!detail) return res.status(404).json({ ok: false, error: "Event not found" });
  return res.json({ ok: true, data: detail });
});

router.post("/:id/register", authRequired, async (req, res) => {
  const result = registerForEvent(req.auth.id, req.params.id);
  if (result.error) {
    return res.status(result.status).json({ ok: false, error: result.error });
  }

  if (isSesConfigured()) {
    try {
      const user = await findUserById(req.auth.id);
      if (user && result.event) {
        await sendEventRegistrationEmail(user, result.event);
      }
    } catch {
      /* email failure should not block registration */
    }
  }

  return res.json({ ok: true, data: result });
});

export default router;
