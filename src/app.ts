import type { Response } from "express";

import { authMiddleware } from "@middleware/auth.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import type { AuthenticatedRequest } from "./middleware/auth.middleware.js";

import authRouter from "./modules/auth/auth.route.js";
import healthRouter from "./routes/health.routes.js";

export const createApp = () => {
  const app = express();

  app.use(cors({ credentials: true, origin: true }));
  app.use(cookieParser());
  app.use(express.json());

  // Initialize all routes
  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.get("/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    return res.status(200).json({ user });
  });

  return app;
};

export const app = createApp();
