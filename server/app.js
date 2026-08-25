import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import { issueCsrf, csrfProtect } from "./middleware/csrf.js";
import { notFound, errorHandler } from "./middleware/errors.js";
const app = express();
const origins = (process.env.CLIENT_URL || "" )
  .split(",")
  .map((s) => s.trim());
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: (origin, cb) =>
      !origin || origins.includes(origin)
        ? cb(null, true)
        : cb(new Error("CORS origin denied")),
    credentials: true,
  }),
);
app.use(compression());
app.use(
  "/uploads",
  express.static(path.resolve(process.env.UPLOAD_DIR || "./uploads"), {
    maxAge: "7d",
    immutable: true,
    index: false,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== "test") app.use(morgan("combined"));
app.use(
  "/api/admin/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts. Try again later." },
  }),
);
app.use("/api/admin/csrf", issueCsrf);
app.use("/api/admin", csrfProtect, adminRoutes);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", publicRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
