import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { env } from "../env.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    id: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Access token not found" });
      return;
    }

    const checkToken = authHeader.split(" ");
    let accessToken: string | undefined;

    // Accept both "Bearer <token>" and raw "<token>"
    if (checkToken[0]?.toLowerCase() === "bearer") {
      accessToken = checkToken[1];
    } else {
      accessToken = checkToken[0];
    }

    if (!accessToken) {
      res.status(401).json({ message: "Access token not found" });
      return;
    }

    const decode = jwt.verify(accessToken, env.JWT_SECRET) as {
      email: string;
      userId: string;
    };

    req.user = {
      email: decode.email,
      id: decode.userId,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Access token expired" });
      return;
    }
    res.status(401).json({ message: "Invalid access token" });
  }
}
