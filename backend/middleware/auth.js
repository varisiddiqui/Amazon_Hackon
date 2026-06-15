import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "campusflow-dev-secret";

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Authentication required" });
  }

  try {
    const token = header.slice(7);
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.auth = jwt.verify(header.slice(7), JWT_SECRET);
    } catch {
      /* ignore invalid token */
    }
  }
  next();
}
