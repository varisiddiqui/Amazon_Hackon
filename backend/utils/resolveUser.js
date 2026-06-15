import { findUserById } from "../services/authService.js";

export async function resolveUser(req) {
  return findUserById(req.auth.id);
}
