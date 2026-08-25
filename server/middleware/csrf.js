import crypto from "node:crypto";

const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

export function issueCsrf(req, res) {
  const token = crypto.randomBytes(24).toString("hex");
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("csrf_token", token, {
    httpOnly: false,
    // Vercel frontend/backend are different origins. In production the
    // CSRF cookie must be allowed on cross-origin requests.
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({ csrfToken: token });
}

export function csrfProtect(req, res, next) {
  if (SAFE.has(req.method)) return next();

  const cookie = req.cookies?.csrf_token;
  const header = req.get("x-csrf-token");

  if (!cookie || !header || cookie !== header) {
    return res.status(403).json({ message: "CSRF validation failed" });
  }

  next();
}
